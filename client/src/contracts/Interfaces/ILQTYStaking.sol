// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

interface ILQTYStaking {
    // --- Events --

    event StakeChanged(address indexed staker, uint256 newStake);

    event StakingGainsWithdrawn(
        address indexed staker,
        uint256 LUSDGain,
        uint256 ETHGain
    );

    // --- Functions ---

    function setAddresses(
        address _lqtyTokenAddress,
        address _lusdTokenAddress,
        address _troveManagerAddress,
        address _borrowerOperationsAddress,
        address _activePoolAddress
    ) external;

    function stake(uint256 _LQTYamount) external;

    function unstake(uint256 _LQTYamount) external;

    function increaseF_ETH(uint256 _ETHFee) external;

    function increaseF_LUSD(uint256 _LQTYFee) external;

    function getPendingETHGain(address _user) external view returns (uint256);

    function getPendingLUSDGain(address _user) external view returns (uint256);
}
