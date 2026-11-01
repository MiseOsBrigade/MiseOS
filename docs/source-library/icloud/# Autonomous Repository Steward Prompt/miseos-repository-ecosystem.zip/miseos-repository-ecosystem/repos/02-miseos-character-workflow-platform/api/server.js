import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { verifyManifest, verifyAssetHash } from './manifestVerifier.js';
import { executeWorkflow } from './workflowExecutor.js';

const manifest = JSON.parse(fs.readFileSync(new URL('../manifest/clickable-character.manifest.example.json', import.meta.url), 'utf8'));

function json(res, status, body) {
  res.writeHead(status, {'content-type':'application/json'});
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/health') return json(res, 200, { ok: true, manifestValid: verifyManifest(manifest), assetHashValid: verifyAssetHash(manifest) });
  if (req.url === '/api/manifest-status') return json(res, 200, { manifestValid: verifyManifest(manifest), assetHashValid: verifyAssetHash(manifest), hotspots: manifest.hotspots });
  if (req.url === '/api/execute-workflow' && req.method === 'POST') {
    let raw = '';
    req.on('data', c => raw += c);
    req.on('end', async () => {
      const body = JSON.parse(raw || '{}');
      try { json(res, 200, { ok: true, result: await executeWorkflow(body.actionId, body.context || {}) }); }
      catch (e) { json(res, 403, { ok: false, error: e.message }); }
    });
    return;
  }
  const file = req.url === '/' ? '/index.html' : req.url;
  const full = path.join(process.cwd(), 'frontend', file.replace(/^\//,''));
  if (fs.existsSync(full)) {
    res.writeHead(200);
    res.end(fs.readFileSync(full));
    return;
  }
  json(res, 404, { error: 'not found' });
});

server.listen(process.env.PORT || 3000, () => console.log('MiseOS character runtime listening'));
