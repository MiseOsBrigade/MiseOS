import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'node:crypto';
import { z } from 'zod';
import { config } from './config.js';
import {
  createNonce,
  createSignInMessage,
  normalizeAddress,
  verifyWalletLogin
} from './auth.js';
import { verifyManifest, manifestId } from './manifestVerifier.js';
import { hasRequiredNft } from './nft.js';
import { executeWorkflow, listWorkflows, workflowExists } from './workflowExecutor.js';
import { sessionStore } from './stores.js';
import {
  storeUpload,
  cropUpload,
  cleanupUpload,
  canonicalizeUpload,
  generateFrames,
  exportPack
} from './imageStudio.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: config.frontendOrigin,
  credentials: false,
  methods: ['GET', 'POST']
}));
app.use(express.json({ limit: '14mb' }));

const LoginSchema = z.object({
  address: z.string(),
  message: z.string(),
  signature: z.string()
});

const ActionSchema = z.object({
  manifest: z.unknown(),
  hotspotId: z.string(),
  actionId: z.string()
});

function requireSession(req, res, next) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  const session = token ? sessionStore.get(token) : null;
  if (!session) return res.status(401).json({ error: 'Invalid or expired session' });
  req.session = session;
  req.sessionToken = token;
  next();
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    activeSessions: sessionStore.size,
    workflows: listWorkflows()
  });
});

app.post('/api/auth/nonce', (req, res, next) => {
  try {
    const address = normalizeAddress(req.body.address);
    const nonce = createNonce(address);
    const message = createSignInMessage({ address, nonce });
    res.json({ address, nonce, message });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/verify', async (req, res, next) => {
  try {
    const input = LoginSchema.parse(req.body);
    if (!verifyWalletLogin(input)) {
      return res.status(401).json({ error: 'Signature or nonce invalid' });
    }

    const address = normalizeAddress(input.address);
    let nftAccess = false;
    if (config.nftContractAddress) {
      nftAccess = await hasRequiredNft({
        rpcUrl: config.rpcUrl,
        contractAddress: config.nftContractAddress,
        ownerAddress: address,
        tokenStandard: config.nftTokenStandard,
        tokenId: config.nftTokenId
      });
    }

    const token = sessionStore.create({
      address,
      nftAccess,
      createdAt: Date.now()
    }, config.sessionTtlMs);

    res.json({ token, address, nftAccess, expiresInMs: config.sessionTtlMs });
  } catch (error) {
    next(error);
  }
});

app.get('/api/session', requireSession, (req, res) => {
  res.json(req.session);
});

app.post('/api/logout', requireSession, (req, res) => {
  sessionStore.delete(req.sessionToken);
  res.json({ ok: true });
});

app.post('/api/manifest/verify', (req, res, next) => {
  try {
    const manifest = verifyManifest(req.body.manifest);
    res.json({
      valid: true,
      manifestId: manifestId(manifest),
      character: manifest.character,
      hotspotCount: manifest.hotspots.length
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/authorize-action', requireSession, async (req, res, next) => {
  try {
    const input = ActionSchema.parse(req.body);
    const manifest = verifyManifest(input.manifest);
    const hotspot = manifest.hotspots.find(
      (item) => item.id === input.hotspotId && item.actionId === input.actionId
    );

    if (!hotspot) return res.status(403).json({ allowed: false, reason: 'Hotspot not signed into manifest' });
    if (!workflowExists(hotspot.actionId)) {
      return res.status(403).json({ allowed: false, reason: 'Workflow not in server allowlist' });
    }
    if (hotspot.requiresNft && !req.session.nftAccess) {
      return res.status(403).json({ allowed: false, reason: 'NFT entitlement required' });
    }

    const authorization = {
      authorizationId: crypto.randomUUID(),
      address: req.session.address,
      manifestId: manifestId(manifest),
      characterId: manifest.character.id,
      hotspotId: hotspot.id,
      actionId: hotspot.actionId,
      issuedAt: Date.now()
    };

    res.json({ allowed: true, authorization });
  } catch (error) {
    next(error);
  }
});

app.post('/api/execute-workflow', requireSession, async (req, res, next) => {
  try {
    const { manifest, hotspotId, actionId, params = {} } = req.body;
    const verified = verifyManifest(manifest);
    const hotspot = verified.hotspots.find(
      (item) => item.id === hotspotId && item.actionId === actionId
    );

    // Re-authorize from trusted state. Do not accept client-provided authorization context.
    if (!hotspot || !workflowExists(actionId)) {
      return res.status(403).json({ error: 'Action is not authorized' });
    }
    if (hotspot.requiresNft && !req.session.nftAccess) {
      return res.status(403).json({ error: 'NFT entitlement required' });
    }

    const context = {
      address: req.session.address,
      characterId: verified.character.id,
      manifestId: manifestId(verified),
      hotspotId,
      actionId,
      params,
      executedAt: Date.now()
    };

    const result = await executeWorkflow(actionId, context);
    res.json({ ok: true, actionId, result });
  } catch (error) {
    next(error);
  }
});

// Character Studio
app.post('/api/studio/upload', async (req, res, next) => {
  try { res.json({ ok: true, ...(await storeUpload(req.body)) }); }
  catch (error) { next(error); }
});

app.post('/api/studio/crop', async (req, res, next) => {
  try { res.json({ ok: true, image: await cropUpload(req.body.uploadId, req.body.crop) }); }
  catch (error) { next(error); }
});

app.post('/api/studio/cleanup', async (req, res, next) => {
  try { res.json({ ok: true, image: await cleanupUpload(req.body.uploadId, req.body.fuzz) }); }
  catch (error) { next(error); }
});

app.post('/api/studio/canonicalize', async (req, res, next) => {
  try { res.json({ ok: true, image: await canonicalizeUpload(req.body.uploadId) }); }
  catch (error) { next(error); }
});

app.post('/api/studio/generate-frames', async (req, res, next) => {
  try { res.json({ ok: true, frames: await generateFrames(req.body.uploadId) }); }
  catch (error) { next(error); }
});

app.post('/api/studio/export', async (req, res, next) => {
  try {
    const zip = await exportPack(
      req.body.uploadId,
      req.body.characterDraft,
      req.body.validationReport
    );
    res
      .status(200)
      .type('application/zip')
      .set('Content-Disposition', 'attachment; filename="miseos-character-pack.zip"')
      .send(zip);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error instanceof z.ZodError ? 400 : 400;
  res.status(status).json({
    error: error instanceof Error ? error.message : 'Request failed'
  });
});

app.listen(config.port, () => {
  console.log(`MiseOS Clickable Character API listening on :${config.port}`);
});
