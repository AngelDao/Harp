// SPDX-License-Identifier: MIT

pragma solidity 0.6.11 ;

interface IStabilityPool {
    // --- Events ---

    event ETHBalanceUpdated(uint256 _newBalance);
    event LUSDBalanceUpdated(uint256 _newBalance);

    event BorrowerOperationsAddressChanged(
        address _newBorrowerOperationsAddress
    );
    event TroveManagerAddressChanged(address _newTroveManagerAddress);
    event ActivePoolAddressChanged(address _newActivePoolAddress);
    event DefaultPoolAddressChanged(address _newDefaultPoolAddress);
    event LUSDTokenAddressChanged(address _newLUSDTokenAddress);
    event SortedTrovesAddressChanged(address _newSortedTrovesAddress);
    event PriceFeedAddressChanged(address _newPriceFeedAddress);
    event CommunityIssuanceAddressChanged(address _newCommunityIssuanceAddress);

    event P_Updated(uint256 _P);
    event S_Updated(uint256 _S);
    event G_Updated(uint256 _G);

    event FrontEndRegistered(address indexed _frontEnd, uint256 _kickbackRate);

    event DepositSnapshotUpdated(
        address indexed _depositor,
        uint256 _P,
        uint256 _S,
        uint256 _G
    );
    event FrontEndSnapshotUpdated(
        address indexed _frontEnd,
        uint256 _P,
        uint256 _G
    );

    event UserDepositChanged(address indexed _depositor, uint256 _newDeposit);
    event FrontEndStakeChanged(
        address indexed _frontEnd,
        uint256 _newFrontEndStake,
        address _depositor
    );

    event ETHGainWithdrawn(
        address indexed _depositor,
        uint256 _ETH,
        uint256 _LUSDLoss
    );
    event LQTYPaidToDepositor(address indexed _depositor, uint256 _LQTY);
    event LQTYPaidToFrontEnd(address indexed _frontEnd, uint256 _LQTY);

    event EtherSent(address _to, uint256 _amount);

    // --- Functions ---

    function setAddresses(
        address _borrowerOperationsAddress,
        address _troveManagerAddress,
        address _activePoolAddress,
        address _lusdTokenAddress,
        address _sortedTrovesAddress,
        address _priceFeedAddress,
        address _communityIssuanceAddress
    ) external;

    function provideToSP(uint256 _amount, address _frontEndTag) external;

    function withdrawFromSP(uint256 _amount) external;

    function withdrawETHGainToTrove(address _upperHint, address _lowerHint)
        external;

    function registerFrontEnd(uint256 _kickbackRate) external;

    function offset(uint256 _debt, uint256 _coll) external;

    function getETH() external view returns (uint256);

    function getTotalLUSDDeposits() external view returns (uint256);

    function getDepositorETHGain(address _depositor)
        external
        view
        returns (uint256);

    function getDepositorLQTYGain(address _depositor)
        external
        view
        returns (uint256);

    function getFrontEndLQTYGain(address _frontEnd)
        external
        view
        returns (uint256);

    function getCompoundedLUSDDeposit(address _depositor, bool _test)
        external
        view
        returns (uint256);

    function getCompoundedFrontEndStake(address _frontEnd)
        external
        view
        returns (uint256);
}
