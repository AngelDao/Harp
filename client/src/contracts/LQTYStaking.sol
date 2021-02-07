// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./LQTYToken.sol";

contract LQTYStaking {
    struct UserInfo {
        uint256 amount;
    }

    LQTYToken public lqtyToken;
    mapping(address => UserInfo) public userInfo;

    constructor(LQTYToken _lqtyToken) {
        lqtyToken = _lqtyToken;
    }

    function stake(uint256 _amount) public {
        lqtyToken.transferFrom(msg.sender, address(this), _amount);
    }

    function unstake(uint256 _amount) public {
        lqtyToken.transfer(msg.sender, _amount);
    }
}
