// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LUSDLPToken is ERC20 {
    constructor(address _owner, address _owner2)
        ERC20("LUSD LP Token", "UNI-LP")
    {
        _mint(_owner, 1000000000000000000000);
        _mint(_owner2, 1000000000000000000000);
    }
}
