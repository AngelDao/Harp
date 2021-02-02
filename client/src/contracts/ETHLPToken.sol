// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ETHLPToken is ERC20 {
    constructor(address _owner, address _owner2)
        ERC20("ETH LP Token", "UNI-LP")
    {}
}