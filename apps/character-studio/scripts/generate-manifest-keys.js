import crypto from 'node:crypto';
import fs from 'node:fs';

fs.mkdirSync('./keys', { recursive: true });
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');

fs.writeFileSync('./keys/manifest-public.pem', publicKey.export({ type: 'spki', format: 'pem' }), { mode: 0o644 });
fs.writeFileSync('./keys/manifest-private.pem', privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
console.log('Generated Ed25519 manifest key pair in ./keys');
