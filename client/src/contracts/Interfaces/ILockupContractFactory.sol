// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;
    
interface ILockupContractFactory {
    
    // --- Events ---

    event LQTYTokenAddressSet(address _lqtyTokenAddress);

    // --- Functions ---

    function setLQTYTokenAddress(address _lqtyTokenAddress) external;

    function deployLockupContract(address _beneficiary, uint _unlockTime) external;

    function isRegisteredLockup(address _addr) external view returns (bool);
}
