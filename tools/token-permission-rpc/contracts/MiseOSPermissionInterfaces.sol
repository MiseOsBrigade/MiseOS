// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Reference interfaces only. Audit before production use.
interface IMiseOSDelegationManager {
    struct Execution {
        address target;
        uint256 value;
        bytes callData;
    }

    function redeemDelegations(
        bytes[] calldata permissionContexts,
        bytes32[] calldata modes,
        bytes[] calldata executionCallData
    ) external;
}

interface IMiseOSPermissionRevoker {
    event PermissionContextRevoked(bytes32 indexed contextHash, address indexed revoker);

    function revokePermissionContext(bytes calldata context) external;
}

/// @notice Minimal ERC-721-like reference skeleton for metadata planning.
/// Use audited OpenZeppelin ERC721/ERC2981 in production.
contract MiseOSTokenReference {
    string public constant name = "MiseOS Token";
    string public constant symbol = "MISEOS";

    address public owner;
    uint256 public totalSupply;

    mapping(uint256 => address) public ownerOf;
    mapping(uint256 => string) public tokenURI;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event PermissionContextUsed(bytes32 indexed contextHash, address indexed operator, uint256 indexed tokenId);

    error NotOwner();
    error ZeroAddress();

    constructor() {
        owner = msg.sender;
    }

    function mintReference(address to, string calldata uri, bytes calldata permissionContext) external returns (uint256 tokenId) {
        if (to == address(0)) revert ZeroAddress();

        // Reference-only guard: production should verify this context through
        // a wallet-supported delegation manager and explicit rule enforcement.
        bytes32 contextHash = keccak256(permissionContext);

        tokenId = ++totalSupply;
        ownerOf[tokenId] = to;
        tokenURI[tokenId] = uri;

        emit PermissionContextUsed(contextHash, msg.sender, tokenId);
        emit Transfer(address(0), to, tokenId);
    }
}
