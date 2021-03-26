"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadableEthersLiquity = void 0;
const lib_base_1 = require("@liquity/lib-base");
const EthersLiquityConnection_1 = require("./EthersLiquityConnection");
const BlockPolledLiquityStore_1 = require("./BlockPolledLiquityStore");
// TODO: these are constant in the contracts, so it doesn't make sense to make a call for them,
// but to avoid having to update them here when we change them in the contracts, we could read
// them once after deployment and save them to LiquityDeployment.
const MINUTE_DECAY_FACTOR = lib_base_1.Decimal.from("0.999037758833783000");
const BETA = lib_base_1.Decimal.from(2);
var BackendTroveStatus;
(function (BackendTroveStatus) {
    BackendTroveStatus[BackendTroveStatus["nonExistent"] = 0] = "nonExistent";
    BackendTroveStatus[BackendTroveStatus["active"] = 1] = "active";
    BackendTroveStatus[BackendTroveStatus["closedByOwner"] = 2] = "closedByOwner";
    BackendTroveStatus[BackendTroveStatus["closedByLiquidation"] = 3] = "closedByLiquidation";
    BackendTroveStatus[BackendTroveStatus["closedByRedemption"] = 4] = "closedByRedemption";
})(BackendTroveStatus || (BackendTroveStatus = {}));
const panic = (error) => {
    throw error;
};
const userTroveStatusFrom = (backendStatus) => backendStatus === BackendTroveStatus.nonExistent
    ? "nonExistent"
    : backendStatus === BackendTroveStatus.active
        ? "open"
        : backendStatus === BackendTroveStatus.closedByOwner
            ? "closedByOwner"
            : backendStatus === BackendTroveStatus.closedByLiquidation
                ? "closedByLiquidation"
                : backendStatus === BackendTroveStatus.closedByRedemption
                    ? "closedByRedemption"
                    : panic(new Error(`invalid backendStatus ${backendStatus}`));
const decimalify = (bigNumber) => lib_base_1.Decimal.fromBigNumberString(bigNumber.toHexString());
const validSortingOptions = ["ascendingCollateralRatio", "descendingCollateralRatio"];
const expectPositiveInt = (obj, key) => {
    if (obj[key] !== undefined) {
        if (!Number.isInteger(obj[key])) {
            throw new Error(`${key} must be an integer`);
        }
        if (obj[key] < 0) {
            throw new Error(`${key} must not be negative`);
        }
    }
};
/**
 * Ethers-based implementation of {@link @liquity/lib-base#ReadableLiquity}.
 *
 * @public
 */
class ReadableEthersLiquity {
    /** @internal */
    constructor(connection) {
        this.connection = connection;
    }
    /** @internal */
    static _from(connection) {
        const readable = new ReadableEthersLiquity(connection);
        return connection.useStore === "blockPolled"
            ? new _BlockPolledReadableEthersLiquity(readable)
            : readable;
    }
    /**
     * Connect to the Liquity protocol and create a `ReadableEthersLiquity` object.
     *
     * @param signerOrProvider - Ethers `Signer` or `Provider` to use for connecting to the Ethereum
     *                           network.
     * @param optionalParams - Optional parameters that can be used to customize the connection.
     */
    static async connect(signerOrProvider, optionalParams) {
        return ReadableEthersLiquity._from(await EthersLiquityConnection_1._connect(signerOrProvider, optionalParams));
    }
    hasStore() {
        return false;
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotalRedistributed} */
    async getTotalRedistributed(overrides) {
        const { troveManager } = EthersLiquityConnection_1._getContracts(this.connection);
        const [collateral, debt] = await Promise.all([
            troveManager.L_ETH({ ...overrides }).then(decimalify),
            troveManager.L_LUSDDebt({ ...overrides }).then(decimalify)
        ]);
        return new lib_base_1.Trove(collateral, debt);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTroveBeforeRedistribution} */
    async getTroveBeforeRedistribution(address, overrides) {
        address !== null && address !== void 0 ? address : (address = EthersLiquityConnection_1._requireAddress(this.connection));
        const { troveManager } = EthersLiquityConnection_1._getContracts(this.connection);
        const [trove, snapshot] = await Promise.all([
            troveManager.Troves(address, { ...overrides }),
            troveManager.rewardSnapshots(address, { ...overrides })
        ]);
        if (trove.status === BackendTroveStatus.active) {
            return new lib_base_1.TroveWithPendingRedistribution(address, userTroveStatusFrom(trove.status), decimalify(trove.coll), decimalify(trove.debt), decimalify(trove.stake), new lib_base_1.Trove(decimalify(snapshot.ETH), decimalify(snapshot.LUSDDebt)));
        }
        else {
            return new lib_base_1.TroveWithPendingRedistribution(address, userTroveStatusFrom(trove.status));
        }
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTrove} */
    async getTrove(address, overrides) {
        const [trove, totalRedistributed] = await Promise.all([
            this.getTroveBeforeRedistribution(address, overrides),
            this.getTotalRedistributed(overrides)
        ]);
        return trove.applyRedistribution(totalRedistributed);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getNumberOfTroves} */
    async getNumberOfTroves(overrides) {
        const { troveManager } = EthersLiquityConnection_1._getContracts(this.connection);
        return (await troveManager.getTroveOwnersCount({ ...overrides })).toNumber();
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getPrice} */
    getPrice(overrides) {
        const { priceFeed } = EthersLiquityConnection_1._getContracts(this.connection);
        // fetchPrice() fails when called through BatchedProvider, because that uses a helper contract
        // that dispatches batched calls using STATICCALL, and fetchPrice() tries to modify state, which
        // "will result in an exception instead of performing the modification" (EIP-214).
        // Passing a pointless gasPrice override ensures that the call is performed directly --
        // bypassing the helper contract -- because BatchedProvider has no support for overrides other
        // than blockTag.
        return priceFeed.callStatic.fetchPrice({ ...overrides, gasPrice: 0 }).then(decimalify);
    }
    /** @internal */
    async _getActivePool(overrides) {
        const { activePool } = EthersLiquityConnection_1._getContracts(this.connection);
        const [activeCollateral, activeDebt] = await Promise.all([
            activePool.getETH({ ...overrides }),
            activePool.getLUSDDebt({ ...overrides })
        ].map(getBigNumber => getBigNumber.then(decimalify)));
        return new lib_base_1.Trove(activeCollateral, activeDebt);
    }
    /** @internal */
    async _getDefaultPool(overrides) {
        const { defaultPool } = EthersLiquityConnection_1._getContracts(this.connection);
        const [liquidatedCollateral, closedDebt] = await Promise.all([
            defaultPool.getETH({ ...overrides }),
            defaultPool.getLUSDDebt({ ...overrides })
        ].map(getBigNumber => getBigNumber.then(decimalify)));
        return new lib_base_1.Trove(liquidatedCollateral, closedDebt);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotal} */
    async getTotal(overrides) {
        const [activePool, defaultPool] = await Promise.all([
            this._getActivePool(overrides),
            this._getDefaultPool(overrides)
        ]);
        return activePool.add(defaultPool);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getStabilityDeposit} */
    async getStabilityDeposit(address, overrides) {
        address !== null && address !== void 0 ? address : (address = EthersLiquityConnection_1._requireAddress(this.connection));
        const { stabilityPool } = EthersLiquityConnection_1._getContracts(this.connection);
        const [initialLUSD, currentLUSD, collateralGain, lqtyReward] = await Promise.all([
            stabilityPool.deposits(address, { ...overrides }).then(d => d.initialValue),
            stabilityPool.getCompoundedLUSDDeposit(address, { ...overrides }),
            stabilityPool.getDepositorETHGain(address, { ...overrides }),
            stabilityPool.getDepositorLQTYGain(address, { ...overrides })
        ].map(getBigNumber => getBigNumber.then(decimalify)));
        return new lib_base_1.StabilityDeposit(initialLUSD, currentLUSD, collateralGain, lqtyReward);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLUSDInStabilityPool} */
    getLUSDInStabilityPool(overrides) {
        const { stabilityPool } = EthersLiquityConnection_1._getContracts(this.connection);
        return stabilityPool.getTotalLUSDDeposits({ ...overrides }).then(decimalify);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLUSDBalance} */
    getLUSDBalance(address, overrides) {
        address !== null && address !== void 0 ? address : (address = EthersLiquityConnection_1._requireAddress(this.connection));
        const { lusdToken } = EthersLiquityConnection_1._getContracts(this.connection);
        return lusdToken.balanceOf(address, { ...overrides }).then(decimalify);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLQTYBalance} */
    getLQTYBalance(address, overrides) {
        address !== null && address !== void 0 ? address : (address = EthersLiquityConnection_1._requireAddress(this.connection));
        const { lqtyToken } = EthersLiquityConnection_1._getContracts(this.connection);
        return lqtyToken.balanceOf(address, { ...overrides }).then(decimalify);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getCollateralSurplusBalance} */
    getCollateralSurplusBalance(address, overrides) {
        address !== null && address !== void 0 ? address : (address = EthersLiquityConnection_1._requireAddress(this.connection));
        const { collSurplusPool } = EthersLiquityConnection_1._getContracts(this.connection);
        return collSurplusPool.getCollateral(address, { ...overrides }).then(decimalify);
    }
    async getTroves(params, overrides) {
        var _a, _b;
        const { multiTroveGetter } = EthersLiquityConnection_1._getContracts(this.connection);
        expectPositiveInt(params, "first");
        expectPositiveInt(params, "startingAt");
        if (!validSortingOptions.includes(params.sortedBy)) {
            throw new Error(`sortedBy must be one of: ${validSortingOptions.map(x => `"${x}"`).join(", ")}`);
        }
        const [totalRedistributed, backendTroves] = await Promise.all([
            params.beforeRedistribution ? undefined : this.getTotalRedistributed({ ...overrides }),
            multiTroveGetter.getMultipleSortedTroves(params.sortedBy === "descendingCollateralRatio"
                ? (_a = params.startingAt) !== null && _a !== void 0 ? _a : 0 : -(((_b = params.startingAt) !== null && _b !== void 0 ? _b : 0) + 1), params.first, { ...overrides })
        ]);
        const troves = mapBackendTroves(backendTroves);
        if (totalRedistributed) {
            return troves.map(trove => trove.applyRedistribution(totalRedistributed));
        }
        else {
            return troves;
        }
    }
    /** @internal */
    async _getFeesInNormalMode(overrides) {
        const { troveManager } = EthersLiquityConnection_1._getContracts(this.connection);
        const [lastFeeOperationTime, baseRateWithoutDecay, blockTimestamp] = await Promise.all([
            troveManager.lastFeeOperationTime({ ...overrides }),
            troveManager.baseRate({ ...overrides }).then(decimalify),
            EthersLiquityConnection_1._getBlockTimestamp(this.connection, overrides === null || overrides === void 0 ? void 0 : overrides.blockTag)
        ]);
        const lastFeeOperation = new Date(1000 * lastFeeOperationTime.toNumber());
        return new lib_base_1.Fees(baseRateWithoutDecay, MINUTE_DECAY_FACTOR, BETA, lastFeeOperation, blockTimestamp, false);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getFees} */
    async getFees(overrides) {
        const [feesInNormalMode, total, price] = await Promise.all([
            this._getFeesInNormalMode(overrides),
            this.getTotal(overrides),
            this.getPrice(overrides)
        ]);
        return feesInNormalMode._setRecoveryMode(total.collateralRatioIsBelowCritical(price));
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLQTYStake} */
    async getLQTYStake(address, overrides) {
        address !== null && address !== void 0 ? address : (address = EthersLiquityConnection_1._requireAddress(this.connection));
        const { lqtyStaking } = EthersLiquityConnection_1._getContracts(this.connection);
        const [stakedLQTY, collateralGain, lusdGain] = await Promise.all([
            lqtyStaking.stakes(address, { ...overrides }),
            lqtyStaking.getPendingETHGain(address, { ...overrides }),
            lqtyStaking.getPendingLUSDGain(address, { ...overrides })
        ].map(getBigNumber => getBigNumber.then(decimalify)));
        return new lib_base_1.LQTYStake(stakedLQTY, collateralGain, lusdGain);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotalStakedLQTY} */
    async getTotalStakedLQTY(overrides) {
        const { lqtyStaking } = EthersLiquityConnection_1._getContracts(this.connection);
        return lqtyStaking.totalLQTYStaked({ ...overrides }).then(decimalify);
    }
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getFrontendStatus} */
    async getFrontendStatus(address, overrides) {
        address !== null && address !== void 0 ? address : (address = EthersLiquityConnection_1._requireFrontendAddress(this.connection));
        const { stabilityPool } = EthersLiquityConnection_1._getContracts(this.connection);
        const { registered, kickbackRate } = await stabilityPool.frontEnds(address, { ...overrides });
        return registered
            ? { status: "registered", kickbackRate: decimalify(kickbackRate) }
            : { status: "unregistered" };
    }
}
exports.ReadableEthersLiquity = ReadableEthersLiquity;
const mapBackendTroves = (troves) => troves.map(trove => new lib_base_1.TroveWithPendingRedistribution(trove.owner, "open", // These Troves are coming from the SortedTroves list, so they must be open
decimalify(trove.coll), decimalify(trove.debt), decimalify(trove.stake), new lib_base_1.Trove(decimalify(trove.snapshotETH), decimalify(trove.snapshotLUSDDebt))));
class BlockPolledLiquityStoreBasedCache {
    constructor(store) {
        this._store = store;
    }
    _blockHit(overrides) {
        return (!overrides ||
            overrides.blockTag === undefined ||
            overrides.blockTag === this._store.state.blockTag);
    }
    _userHit(address, overrides) {
        return (this._blockHit(overrides) &&
            (address === undefined || address === this._store.connection.userAddress));
    }
    _frontendHit(address, overrides) {
        return (this._blockHit(overrides) &&
            (address === undefined || address === this._store.connection.frontendTag));
    }
    getTotalRedistributed(overrides) {
        if (this._blockHit(overrides)) {
            return this._store.state.totalRedistributed;
        }
    }
    getTroveBeforeRedistribution(address, overrides) {
        if (this._userHit(address, overrides)) {
            return this._store.state.troveBeforeRedistribution;
        }
    }
    getTrove(address, overrides) {
        if (this._userHit(address, overrides)) {
            return this._store.state.trove;
        }
    }
    getNumberOfTroves(overrides) {
        if (this._blockHit(overrides)) {
            return this._store.state.numberOfTroves;
        }
    }
    getPrice(overrides) {
        if (this._blockHit(overrides)) {
            return this._store.state.price;
        }
    }
    getTotal(overrides) {
        if (this._blockHit(overrides)) {
            return this._store.state.total;
        }
    }
    getStabilityDeposit(address, overrides) {
        if (this._userHit(address, overrides)) {
            return this._store.state.stabilityDeposit;
        }
    }
    getLUSDInStabilityPool(overrides) {
        if (this._blockHit(overrides)) {
            return this._store.state.lusdInStabilityPool;
        }
    }
    getLUSDBalance(address, overrides) {
        if (this._userHit(address, overrides)) {
            return this._store.state.lusdBalance;
        }
    }
    getLQTYBalance(address, overrides) {
        if (this._userHit(address, overrides)) {
            return this._store.state.lqtyBalance;
        }
    }
    getCollateralSurplusBalance(address, overrides) {
        if (this._userHit(address, overrides)) {
            return this._store.state.collateralSurplusBalance;
        }
    }
    _getFeesInNormalMode(overrides) {
        if (this._blockHit(overrides)) {
            return this._store.state._feesInNormalMode;
        }
    }
    getFees(overrides) {
        if (this._blockHit(overrides)) {
            return this._store.state.fees;
        }
    }
    getLQTYStake(address, overrides) {
        if (this._userHit(address, overrides)) {
            return this._store.state.lqtyStake;
        }
    }
    getTotalStakedLQTY(overrides) {
        if (this._blockHit(overrides)) {
            return this._store.state.totalStakedLQTY;
        }
    }
    getFrontendStatus(address, overrides) {
        if (this._frontendHit(address, overrides)) {
            return this._store.state.frontend;
        }
    }
    getTroves() {
        return undefined;
    }
}
class _BlockPolledReadableEthersLiquity extends lib_base_1._CachedReadableLiquity {
    constructor(readable) {
        const store = new BlockPolledLiquityStore_1.BlockPolledLiquityStore(readable);
        super(readable, new BlockPolledLiquityStoreBasedCache(store));
        this.store = store;
        this.connection = readable.connection;
    }
    hasStore(store) {
        return store === undefined || store === "blockPolled";
    }
    _getActivePool() {
        throw new Error("Method not implemented.");
    }
    _getDefaultPool() {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=ReadableEthersLiquity.js.map