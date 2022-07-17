// SPDX-License-Identifier: Unlicensed
pragma solidity 0.5.10;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token1 is ERC20, ERC20Detailed {
    constructor() public ERC20Detailed("Token1", "T1", 18) {
        _mint(msg.sender, 10**18 * 10000000);
    }
}

contract Token2 is ERC20, ERC20Detailed {
    constructor() public ERC20Detailed("Token2", "T2", 18) {
        _mint(msg.sender, 10**18 * 10000000);
    }
}
