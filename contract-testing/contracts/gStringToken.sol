// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract gStringToken is ERC20, ERC20Burnable {
    mapping(address => bool) internal allowedMinters;
    address public owner;

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyVerified {
        require(
            allowedMinters[msg.sender] == true,
            "Sender not a verified Minter"
        );
        _;
    }

    constructor(address _owner)
        public
        ERC20("Goverance String Token", "gSTRING")
    {
        owner = _owner;
    }

    function isAllowedMinter(address _for) external view returns (bool) {
        return allowedMinters[_for];
    }

    function addMinter(address _vestingAddress) external onlyOwner {
        allowedMinters[_vestingAddress] = true;
    }

    function mintTo(address _to, uint256 _amount) external onlyVerified {
        _mint(_to, _amount);
    }

     function revokeOwnership () external onlyOwner {
        owner = "";
    }
}
