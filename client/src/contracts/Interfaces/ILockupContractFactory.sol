// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

interface ILockupContractFactory {
    // --- Events ---

    event LQTYTokenAddressSet(address _lqtyTokenAddress);

    // --- Functions ---

    function setLQTYTokenAddress(address _lqtyTokenAddress) external;

    function deployLockupContract(address _beneficiary, uint256 _unlockTime)
        external;

    function isRegisteredLockup(address _addr) external view returns (bool);
}
