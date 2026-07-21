// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

contract ProofRegistry {
    struct Proof { address issuer; uint64 issuedAt; string metadataUri; }
    mapping(bytes32 => Proof) public proofs;
    event ArtifactRegistered(bytes32 indexed artifactHash, address indexed issuer, string metadataUri, uint64 issuedAt);
    error AlreadyRegistered(bytes32 artifactHash);
    error EmptyMetadataUri();

    function registerArtifact(bytes32 artifactHash, string calldata metadataUri) external {
        if (bytes(metadataUri).length == 0) revert EmptyMetadataUri();
        if (proofs[artifactHash].issuer != address(0)) revert AlreadyRegistered(artifactHash);
        uint64 issuedAt = uint64(block.timestamp);
        proofs[artifactHash] = Proof(msg.sender, issuedAt, metadataUri);
        emit ArtifactRegistered(artifactHash, msg.sender, metadataUri, issuedAt);
    }
}
