import crypto from 'node:crypto';

export class ExpiringStore {
  #entries = new Map();

  set(key, value, ttlMs) {
    this.#entries.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  take(key) {
    const entry = this.#entries.get(key);
    this.#entries.delete(key);
    if (!entry || entry.expiresAt <= Date.now()) return null;
    return entry.value;
  }

  get(key) {
    const entry = this.#entries.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.#entries.delete(key);
      return null;
    }
    return entry.value;
  }

  delete(key) {
    this.#entries.delete(key);
  }

  create(value, ttlMs) {
    const key = crypto.randomBytes(32).toString('base64url');
    this.set(key, value, ttlMs);
    return key;
  }

  get size() {
    this.sweep();
    return this.#entries.size;
  }

  sweep() {
    const now = Date.now();
    for (const [key, entry] of this.#entries) {
      if (entry.expiresAt <= now) this.#entries.delete(key);
    }
  }
}

export const nonceStore = new ExpiringStore();
export const sessionStore = new ExpiringStore();
export const uploadStore = new ExpiringStore();
