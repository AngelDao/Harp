// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "../Dependencies/TestIERC20.sol";
import "../Dependencies/IERC2612.sol";

interface ILQTYToken is TestIERC20, IERC2612 {
    // --- Events ---

    event CommunityIssuanceAddressSet(address _communityIssuanceAddress);

    event LQTYStakingAddressSet(address _lqtyStakingAddress);

    event LockupContractFactoryAddressSet(
        address _lockupContractFactoryAddress
    );

    // --- Functions ---

    function sendToLQTYStaking(address _sender, uint256 _amount) external;

    function getDeploymentStartTime() external view returns (uint256);

    function getLpRewardsEntitlement() external view returns (uint256);
}
