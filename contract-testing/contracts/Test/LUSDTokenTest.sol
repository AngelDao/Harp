// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LUSDTokenTest is ERC20 {
    constructor(address _owner, address _owner2)
        public
        ERC20("LUSD Token", "LUSD")
    {}

    function mintTo(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
