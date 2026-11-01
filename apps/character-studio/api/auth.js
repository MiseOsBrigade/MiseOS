import crypto from 'node:crypto';
import { getAddress, verifyMessage } from 'ethers';
import { config } from './config.js';
import { nonceStore } from './stores.js';

export function normalizeAddress(address) {
  return getAddress(address).toLowerCase();
}

export function createNonce(address) {
  const normalized = normalizeAddress(address);
  const nonce = crypto.randomBytes(24).toString('base64url');
  nonceStore.set(normalized, nonce, config.nonceTtlMs);
  return nonce;
}

export function createSignInMessage({ address, nonce }) {
  const normalized = normalizeAddress(address);
  return [
    'Sign in to MiseOS Clickable Character',
    '',
    `Domain: ${config.appDomain}`,
    `Address: ${normalized}`,
    `Nonce: ${nonce}`,
    'Statement: Authorize this browser session only. No transaction is requested.'
  ].join('\n');
}

export function verifyWalletLogin({ address, message, signature }) {
  const normalized = normalizeAddress(address);
  const expectedNonce = nonceStore.take(normalized);
  if (!expectedNonce) return false;

  const expectedMessage = createSignInMessage({
    address: normalized,
    nonce: expectedNonce
  });

  if (message !== expectedMessage) return false;

  const recovered = verifyMessage(message, signature).toLowerCase();
  return recovered === normalized;
}
