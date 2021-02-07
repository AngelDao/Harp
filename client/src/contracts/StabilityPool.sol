// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./LUSDToken.sol";

contract StabilityPool {
    struct UserInfo {
        uint256 amount;
    }

    LUSDToken public lusdToken;
    mapping(address => UserInfo) public userInfo;

    constructor(LUSDToken _lusdToken) {
        lusdToken = _lusdToken;
    }

    function provideToSP(uint256 _amount) public {
        lusdToken.transferFrom(msg.sender, address(this), _amount);
    }

    function withdrawFromSP(uint256 _amount) public {
        lusdToken.transfer(msg.sender, _amount);
    }

    function withdrawETHGainToTrove(address _hint) public returns (address) {
        return _hint;
    }
}
