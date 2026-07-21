// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import {ProofRegistry} from "../src/ProofRegistry.sol";

contract ProofRegistryTest {
    ProofRegistry private registry;

    function setUp() public { registry = new ProofRegistry(); }

    function testRegistersArtifact() public {
        bytes32 hash = keccak256("artifact");
        registry.registerArtifact(hash, "ipfs://manifest");
        (address issuer, uint64 issuedAt, string memory uri) = registry.proofs(hash);
        require(issuer == address(this), "wrong issuer");
        require(issuedAt > 0, "missing timestamp");
        require(keccak256(bytes(uri)) == keccak256(bytes("ipfs://manifest")), "wrong uri");
    }

    function testRejectsDuplicate() public {
        bytes32 hash = keccak256("artifact");
        registry.registerArtifact(hash, "ipfs://one");
        try registry.registerArtifact(hash, "ipfs://two") { revert("expected duplicate rejection"); } catch {}
    }

    function testRejectsEmptyUri() public {
        try registry.registerArtifact(keccak256("artifact"), "") { revert("expected empty uri rejection"); } catch {}
    }
}
