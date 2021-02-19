// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "./IPool.sol";

interface IActivePool is IPool {
    function sendETH(address _account, uint256 _amount) external;
}
