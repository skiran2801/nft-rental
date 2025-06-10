// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

// Extended interface for minting functionality
interface IERC721Extended is IERC721, IERC721Metadata {
    function safeMint(address to, string memory uri) external returns (uint256);
}