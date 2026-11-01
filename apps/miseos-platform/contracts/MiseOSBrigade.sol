// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract MiseOSBrigade is ERC721, Ownable, ReentrancyGuard {
    uint256 public immutable maxSupply;
    uint256 public mintPrice;
    uint256 public totalMinted;
    string public baseMetadataURI;
    bool public mintingOpen;

    error MintClosed();
    error SoldOut();
    error IncorrectPayment();
    error WithdrawFailed();

    constructor(uint256 maxSupply_, uint256 mintPrice_, string memory baseMetadataURI_)
        ERC721('MiseOS Brigade', 'MISE')
        Ownable(msg.sender)
    {
        maxSupply = maxSupply_;
        mintPrice = mintPrice_;
        baseMetadataURI = baseMetadataURI_;
    }

    function mint() external payable nonReentrant returns (uint256 tokenId) {
        if (!mintingOpen) revert MintClosed();
        if (totalMinted >= maxSupply) revert SoldOut();
        if (msg.value != mintPrice) revert IncorrectPayment();
        tokenId = ++totalMinted;
        _safeMint(msg.sender, tokenId);
    }

    function ownerMint(address recipient) external onlyOwner returns (uint256 tokenId) {
        if (totalMinted >= maxSupply) revert SoldOut();
        tokenId = ++totalMinted;
        _safeMint(recipient, tokenId);
    }

    function setMintingOpen(bool open) external onlyOwner { mintingOpen = open; }
    function setMintPrice(uint256 newPrice) external onlyOwner { mintPrice = newPrice; }
    function setBaseMetadataURI(string calldata newBaseURI) external onlyOwner { baseMetadataURI = newBaseURI; }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string.concat(baseMetadataURI, _toString(tokenId), '.json');
    }

    function withdraw(address payable recipient) external onlyOwner nonReentrant {
        (bool ok, ) = recipient.call{value: address(this).balance}('');
        if (!ok) revert WithdrawFailed();
    }

    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) return '0';
        uint256 digits;
        uint256 temp = value;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + value % 10));
            value /= 10;
        }
        return string(buffer);
    }
}
