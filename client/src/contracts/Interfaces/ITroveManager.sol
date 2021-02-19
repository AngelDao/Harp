// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

// Common interface for the Trove Manager.
interface ITroveManager {
    // --- Events ---

    event BorrowerOperationsAddressChanged(
        address _newBorrowerOperationsAddress
    );

    event PriceFeedAddressChanged(address _newPriceFeedAddress);

    event LUSDTokenAddressChanged(address _newLUSDTokenAddress);

    event ActivePoolAddressChanged(address _activePoolAddress);

    event DefaultPoolAddressChanged(address _defaultPoolAddress);

    event StabilityPoolAddressChanged(address _stabilityPoolAddress);

    event GasPoolAddressChanged(address _gasPoolAddress);

    event CollSurplusPoolAddressChanged(address _collSurplusPoolAddress);

    event SortedTrovesAddressChanged(address _sortedTrovesAddress);

    event LQTYTokenAddressChanged(address _lqtyTokenAddress);

    event LQTYStakingAddressChanged(address _lqtyStakingAddress);

    event TroveCreated(address indexed _borrower, uint256 arrayIndex);

    event TroveUpdated(
        address indexed _borrower,
        uint256 _debt,
        uint256 _coll,
        uint256 stake,
        uint8 operation
    );

    event TroveLiquidated(
        address indexed _borrower,
        uint256 _debt,
        uint256 _coll,
        uint8 operation
    );

    // --- Functions ---

    function setAddresses(
        address _borrowerOperationsAddress,
        address _activePoolAddress,
        address _defaultPoolAddress,
        address _stabilityPoolAddress,
        address _gasPoolAddress,
        address _collSurplusPoolAddress,
        address _priceFeedAddress,
        address _lusdTokenAddress,
        address _sortedTrovesAddress,
        address _lqtyTokenAddress,
        address _lqtyStakingAddress
    ) external;

    function getTroveOwnersCount() external view returns (uint256);

    function getTroveFromTroveOwnersArray(uint256 _index)
        external
        view
        returns (address);

    function getNominalICR(address _borrower) external view returns (uint256);

    function getCurrentICR(address _borrower, uint256 _price)
        external
        view
        returns (uint256);

    function liquidate(address _borrower) external;

    function liquidateTroves(uint256 _n) external;

    function batchLiquidateTroves(address[] calldata _troveArray) external;

    function redeemCollateral(
        uint256 _LUSDAmount,
        address _firstRedemptionHint,
        address _upperPartialRedemptionHint,
        address _lowerPartialRedemptionHint,
        uint256 _partialRedemptionHintNICR,
        uint256 _maxIterations,
        uint256 _maxFee
    ) external;

    function updateStakeAndTotalStakes(address _borrower)
        external
        returns (uint256);

    function updateTroveRewardSnapshots(address _borrower) external;

    function addTroveOwnerToArray(address _borrower)
        external
        returns (uint256 index);

    function applyPendingRewards(address _borrower) external;

    function getPendingETHReward(address _borrower)
        external
        view
        returns (uint256);

    function getPendingLUSDDebtReward(address _borrower)
        external
        view
        returns (uint256);

    function hasPendingRewards(address _borrower) external view returns (bool);

    function getEntireDebtAndColl(address _borrower)
        external
        view
        returns (
            uint256 debt,
            uint256 coll,
            uint256 pendingLUSDDebtReward,
            uint256 pendingETHReward
        );

    function closeTrove(address _borrower) external;

    function removeStake(address _borrower) external;

    function getRedemptionRate() external view returns (uint256);

    function getBorrowingRate() external view returns (uint256);

    function getBorrowingFee(uint256 LUSDDebt) external view returns (uint256);

    function decayBaseRateFromBorrowing() external;

    function getTroveStatus(address _borrower) external view returns (uint256);

    function getTroveStake(address _borrower) external view returns (uint256);

    function getTroveDebt(address _borrower) external view returns (uint256);

    function getTroveColl(address _borrower) external view returns (uint256);

    function setTroveStatus(address _borrower, uint256 num) external;

    function increaseTroveColl(address _borrower, uint256 _collIncrease)
        external
        returns (uint256);

    function decreaseTroveColl(address _borrower, uint256 _collDecrease)
        external
        returns (uint256);

    function increaseTroveDebt(address _borrower, uint256 _debtIncrease)
        external
        returns (uint256);

    function decreaseTroveDebt(address _borrower, uint256 _collDecrease)
        external
        returns (uint256);

    function getTCR(uint256 _price) external view returns (uint256);

    function checkRecoveryMode(uint256 _price) external view returns (bool);
}
