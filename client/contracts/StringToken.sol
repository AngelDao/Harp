// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StringToken is ERC20 {
    mapping(address => bool) internal allowedMinters;
    // 2 mil * 10e18
    uint256 public HarpDAOAllocation = 2000000000000000000000000;
    address public owner;

    modifier onlyOwner {
        require(msg.sender == owner, "only owner can call this function");
        _;
    }

    modifier onlyVerified {
        require(
            allowedMinters[msg.sender] == true,
            "Sender not a verified Minter"
        );
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _HarpDAOAddress,
        address _owner
    ) public  ERC20(_name, _symbol) {
        owner = _owner;
        _mint(_HarpDAOAddress, HarpDAOAllocation);
    }

    function isAllowedMinter(address _for) external view returns (bool) {
        return allowedMinters[_for];
    }

    function addMinter(address _vestingAddress) external onlyOwner{
        allowedMinters[_vestingAddress] = true;
    }

    function mintTo(address _to, uint256 _amount) external onlyVerified {
        _mint(_to, _amount);
    }

    function revokeOwnership () external onlyOwner {
        owner = address(0);
    }

}
