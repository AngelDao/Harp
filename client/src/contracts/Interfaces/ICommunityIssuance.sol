// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

interface ICommunityIssuance {
    // --- Events ---

    event LQTYTokenAddressSet(address _lqtyTokenAddress);

    event StabilityPoolAddressSet(address _stabilityPoolAddress);

    // --- Functions ---

    function setAddresses(
        address _lqtyTokenAddress,
        address _stabilityPoolAddress
    ) external;

    function issueLQTY() external returns (uint256);

    function sendLQTY(address _account, uint256 _LQTYamount) external;
}
