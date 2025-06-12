// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BitcoinGameToken is ERC20, Ownable {
    constructor() ERC20("Bitcoin Game", "BGA") {
        // Mint 1 billion tokens to the contract deployer
        // 1 billion with 18 decimals (ERC20 standard)
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }
}
