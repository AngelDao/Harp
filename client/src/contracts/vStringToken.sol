// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract vStringToken is ERC20Burnable {
    constructor(address _owner, address _owner2)
        ERC20Burnable("Voting String Token", "vSTRING")
    {
        owner = _owner;
    }

    function isAllowedMinter(address _for) public view returns (bool) {
        return allowedMinters[_for];
    }

    function addVestingAddress(address _vestingAddress) public {
        require(msg.sender == owner, "Only owner can set this contract");
        allowedMinters[_vestingAddress] = true;
    }

    function mintTo(address _to, uint256 _amount) public {
        require(
            allowedMinters[msg.sender] == true,
            "Sender not a verified Minter"
        );
        _mint(_to, _amount);
    }
}
