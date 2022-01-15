// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockNFT is ERC721 {
    uint totalSupply;
    
    constructor() ERC721("GameItem", "ITM") {}

    function mint() public {
        totalSupply++;
        _mint(msg.sender, totalSupply);
    }
}