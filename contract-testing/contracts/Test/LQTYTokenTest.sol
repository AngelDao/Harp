// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LQTYTokenTest is ERC20 {
    constructor(address _owner, address _owner2)
        public
        ERC20("LUSD Token", "LUSD")
    {
        _mint(_owner, 1000000000000000000000);
        _mint(_owner2, 1000000000000000000000);
    }

    function mintTo(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
