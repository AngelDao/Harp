"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableEthersLiquity = void 0;
const EthersLiquityConnection_1 = require("./EthersLiquityConnection");
const debouncingDelayMs = 50;
const debounce = (listener) => {
    let timeoutId = undefined;
    let latestBlock = 0;
    return (...args) => {
        const event = args[args.length - 1];
        if (event.blockNumber !== undefined && event.blockNumber > latestBlock) {
            latestBlock = event.blockNumber;
        }
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            listener(latestBlock);
            timeoutId = undefined;
        }, debouncingDelayMs);
    };
};
/** @alpha */
class ObservableEthersLiquity {
    constructor(readable) {
        this._readable = readable;
    }
    watchTotalRedistributed(onTotalRedistributedChanged) {
        const { activePool, defaultPool } = EthersLiquityConnection_1._getContracts(this._readable.connection);
        const etherSent = activePool.filters.EtherSent();
        const redistributionListener = debounce((blockTag) => {
            this._readable.getTotalRedistributed({ blockTag }).then(onTotalRedistributedChanged);
        });
        const etherSentListener = (toAddress, _amount, event) => {
            if (toAddress === defaultPool.address) {
                redistributionListener(event);
            }
        };
        activePool.on(etherSent, etherSentListener);
        return () => {
            activePool.removeListener(etherSent, etherSentListener);
        };
    }
    watchTroveWithoutRewards(onTroveChanged, address) {
        address !== null && address !== void 0 ? address : (address = EthersLiquityConnection_1._requireAddress(this._readable.connection));
        const { troveManager, borrowerOperations } = EthersLiquityConnection_1._getContracts(this._readable.connection);
        const troveUpdatedByTroveManager = troveManager.filters.TroveUpdated(address);
        const troveUpdatedByBorrowerOperations = borrowerOperations.filters.TroveUpdated(address);
        const troveListener = debounce((blockTag) => {
            this._readable.getTroveBeforeRedistribution(address, { blockTag }).then(onTroveChanged);
        });
        troveManager.on(troveUpdatedByTroveManager, troveListener);
        borrowerOperations.on(troveUpdatedByBorrowerOperations, troveListener);
        return () => {
            troveManager.removeListener(troveUpdatedByTroveManager, troveListener);
            borrowerOperations.removeListener(troveUpdatedByBorrowerOperations, troveListener);
        };
    }
    watchNumberOfTroves(onNumberOfTrovesChanged) {
        const { troveManager } = EthersLiquityConnection_1._getContracts(this._readable.connection);
        const { TroveUpdated } = troveManager.filters;
        const troveUpdated = TroveUpdated();
        const troveUpdatedListener = debounce((blockTag) => {
            this._readable.getNumberOfTroves({ blockTag }).then(onNumberOfTrovesChanged);
        });
        troveManager.on(troveUpdated, troveUpdatedListener);
        return () => {
            troveManager.removeListener(troveUpdated, troveUpdatedListener);
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    watchPrice(onPriceChanged) {
        // TODO revisit
        // We no longer have our own PriceUpdated events. If we want to implement this in an event-based
        // manner, we'll need to listen to aggregator events directly. Or we could do polling.
        throw new Error("Method not implemented.");
    }
    watchTotal(onTotalChanged) {
        const { troveManager } = EthersLiquityConnection_1._getContracts(this._readable.connection);
        const { TroveUpdated } = troveManager.filters;
        const troveUpdated = TroveUpdated();
        const totalListener = debounce((blockTag) => {
            this._readable.getTotal({ blockTag }).then(onTotalChanged);
        });
        troveManager.on(troveUpdated, totalListener);
        return () => {
            troveManager.removeListener(troveUpdated, totalListener);
        };
    }
    watchStabilityDeposit(onStabilityDepositChanged, address) {
        address !== null && address !== void 0 ? address : (address = EthersLiquityConnection_1._requireAddress(this._readable.connection));
        const { activePool, stabilityPool } = EthersLiquityConnection_1._getContracts(this._readable.connection);
        const { UserDepositChanged } = stabilityPool.filters;
        const { EtherSent } = activePool.filters;
        const userDepositChanged = UserDepositChanged(address);
        const etherSent = EtherSent();
        const depositListener = debounce((blockTag) => {
            this._readable.getStabilityDeposit(address, { blockTag }).then(onStabilityDepositChanged);
        });
        const etherSentListener = (toAddress, _amount, event) => {
            if (toAddress === stabilityPool.address) {
                // Liquidation while Stability Pool has some deposits
                // There may be new gains
                depositListener(event);
            }
        };
        stabilityPool.on(userDepositChanged, depositListener);
        activePool.on(etherSent, etherSentListener);
        return () => {
            stabilityPool.removeListener(userDepositChanged, depositListener);
            activePool.removeListener(etherSent, etherSentListener);
        };
    }
    watchLUSDInStabilityPool(onLUSDInStabilityPoolChanged) {
        const { lusdToken, stabilityPool } = EthersLiquityConnection_1._getContracts(this._readable.connection);
        const { Transfer } = lusdToken.filters;
        const transferLUSDFromStabilityPool = Transfer(stabilityPool.address);
        const transferLUSDToStabilityPool = Transfer(null, stabilityPool.address);
        const stabilityPoolLUSDFilters = [transferLUSDFromStabilityPool, transferLUSDToStabilityPool];
        const stabilityPoolLUSDListener = debounce((blockTag) => {
            this._readable.getLUSDInStabilityPool({ blockTag }).then(onLUSDInStabilityPoolChanged);
        });
        stabilityPoolLUSDFilters.forEach(filter => lusdToken.on(filter, stabilityPoolLUSDListener));
        return () => stabilityPoolLUSDFilters.forEach(filter => lusdToken.removeListener(filter, stabilityPoolLUSDListener));
    }
    watchLUSDBalance(onLUSDBalanceChanged, address) {
        address !== null && address !== void 0 ? address : (address = EthersLiquityConnection_1._requireAddress(this._readable.connection));
        const { lusdToken } = EthersLiquityConnection_1._getContracts(this._readable.connection);
        const { Transfer } = lusdToken.filters;
        const transferLUSDFromUser = Transfer(address);
        const transferLUSDToUser = Transfer(null, address);
        const lusdTransferFilters = [transferLUSDFromUser, transferLUSDToUser];
        const lusdTransferListener = debounce((blockTag) => {
            this._readable.getLUSDBalance(address, { blockTag }).then(onLUSDBalanceChanged);
        });
        lusdTransferFilters.forEach(filter => lusdToken.on(filter, lusdTransferListener));
        return () => lusdTransferFilters.forEach(filter => lusdToken.removeListener(filter, lusdTransferListener));
    }
}
exports.ObservableEthersLiquity = ObservableEthersLiquity;
//# sourceMappingURL=ObservableEthersLiquity.js.map