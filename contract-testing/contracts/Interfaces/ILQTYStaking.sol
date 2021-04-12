// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

abstract contract ILQTYStaking {
    mapping(address => uint256) public stakes;

    // --- Events --

    event StakeChanged(address indexed staker, uint256 newStake);

    event StakingGainsWithdrawn(
        address indexed staker,
        uint256 LUSDGain,
        uint256 ETHGain
    );

    constructor() public {}

    // --- Functions ---

    function setAddresses(
        address _lqtyTokenAddress,
        address _lusdTokenAddress,
        address _troveManagerAddress,
        address _borrowerOperationsAddress,
        address _activePoolAddress
    ) external virtual;

    function stake(uint256 _LQTYamount) external virtual;

    function unstake(uint256 _LQTYamount) external virtual;

    function increaseF_ETH(uint256 _ETHFee) external virtual;

    function increaseF_LUSD(uint256 _LQTYFee) external virtual;

    function getPendingETHGain(address _user)
        external
        view
        virtual
        returns (uint256);

    function getPendingLUSDGain(address _user)
        external
        view
        virtual
        returns (uint256);
}
