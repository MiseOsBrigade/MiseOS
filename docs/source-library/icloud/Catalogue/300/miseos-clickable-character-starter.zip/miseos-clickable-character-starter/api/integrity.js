import fs from 'node:fs';import crypto from 'node:crypto';
export function sha256File(filePath){return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');}
export function verifyFileHashOrThrow(filePath,expectedHash){if(!expectedHash)throw new Error(`Missing expected SHA-256 for ${filePath}`);const actual=sha256File(filePath);const expected=expectedHash.trim().split(/\s+/)[0];if(actual!==expected)throw new Error(`Integrity check failed for ${filePath}: expected ${expected}, got ${actual}`);return actual;}
