# Frequently asked questions

## Does ChainGate hold private keys?

No. Signing remains in the user wallet; the application must never request seed phrases.

## Can AI send transactions automatically?

Not in the reference profile. AI proposes typed actions; deterministic code, simulation, policy, preview, and human approval are required.

## Is ChainGate a bridge?

No. Multichain sessions authorize communication with multiple chains; they do not move assets between chains.

## Why store artifacts off-chain?

Large files are unsuitable for direct chain storage. ChainGate stores the binary off-chain and registers a compact digest.

## Does a hash prove authorship?

It proves a wallet registered a digest in chain history. Additional identity, provenance, and legal evidence may be required.

## Why use Blockscout?

It adds indexed context and explorer links. Direct RPC remains the fallback when indexing is delayed.

## Where does C2PA fit?

C2PA adds portable media provenance and complements internal manifests and on-chain digests.

## Can Stripe and on-chain payments grant the same access?

Yes, after both are normalized into verified settled evidence.

## Is the contract upgradeable?

The reference contract is intentionally minimal and non-upgradeable.

## Is this mainnet-ready?

No. Mainnet use requires pinned integrations, complete testing, deployment evidence, monitoring, and independent security review.
