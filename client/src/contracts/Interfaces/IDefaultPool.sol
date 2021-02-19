// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "./IPool.sol";

interface IDefaultPool is IPool {
    function sendETHToActivePool(uint256 _amount) external;
}
