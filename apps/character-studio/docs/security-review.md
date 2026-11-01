# Security review of the original draft

The completed scaffold changes several unsafe or incomplete patterns:

1. **Client authorization context**
   - Original: the client returned `context.authorized = true` to the execution endpoint.
   - Fixed: the execution endpoint re-verifies the signed manifest, hotspot, workflow allowlist,
     session, and NFT entitlement.

2. **Dynamic module paths**
   - Original: registry JSON values were used as dynamic import paths.
   - Fixed: workflow handlers are statically imported and frozen into a server-owned map.

3. **Wallet challenge mismatch**
   - Original: the server generated one message format but the frontend signed another.
   - Fixed: `/api/auth/nonce` returns the exact canonical message to sign.

4. **Replay handling**
   - Original: nonce checks were partial.
   - Fixed: nonce retrieval is destructive and time bounded.

5. **Manifest signature**
   - Original: asset hash format could pass without hashing the asset.
   - Fixed: manifest signing is detached and deterministic. Production ingestion must additionally
     hash the actual asset bytes before publication.

6. **NFT failures**
   - Original: failures were logged while login still succeeded with ambiguous access.
   - Fixed: NFT entitlement remains false unless positively verified.

7. **Image processing**
   - Original: 50 MB JSON bodies and unbounded decoded images.
   - Fixed: 10 MB default input cap and 20-megapixel decode cap.

8. **“Production-ready” storage**
   - Process-local maps are explicitly documented as development-only.
   - Redis, PostgreSQL, object storage, queues, KMS, and audit logging are required for production.

9. **Sprite generation**
   - Frame generation creates deterministic motion transforms, not fabricated new character poses.
   - A real animation pipeline should use approved rigging or reviewed generative outputs.
