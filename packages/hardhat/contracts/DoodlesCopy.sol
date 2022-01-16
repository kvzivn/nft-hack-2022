// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DoodlesCopy is ERC721 {
    using Strings for uint256;
    uint totalSupply;
    
    constructor() ERC721("GameItem", "ITM") {}

    function mint() public {
        totalSupply++;
        _mint(msg.sender, totalSupply);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return string(abi.encodePacked("ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/", tokenId.toString()));
    }
}