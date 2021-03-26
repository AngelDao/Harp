"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._CachedReadableLiquity = void 0;
/** @internal */
class _CachedReadableLiquity {
    constructor(readable, cache) {
        this._readable = readable;
        this._cache = cache;
    }
    async getTotalRedistributed(...extraParams) {
        var _a;
        return ((_a = this._cache.getTotalRedistributed(...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getTotalRedistributed(...extraParams));
    }
    async getTroveBeforeRedistribution(address, ...extraParams) {
        var _a;
        return ((_a = this._cache.getTroveBeforeRedistribution(address, ...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getTroveBeforeRedistribution(address, ...extraParams));
    }
    async getTrove(address, ...extraParams) {
        const [troveBeforeRedistribution, totalRedistributed] = await Promise.all([
            this.getTroveBeforeRedistribution(address, ...extraParams),
            this.getTotalRedistributed(...extraParams)
        ]);
        return troveBeforeRedistribution.applyRedistribution(totalRedistributed);
    }
    async getNumberOfTroves(...extraParams) {
        var _a;
        return ((_a = this._cache.getNumberOfTroves(...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getNumberOfTroves(...extraParams));
    }
    async getPrice(...extraParams) {
        var _a;
        return (_a = this._cache.getPrice(...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getPrice(...extraParams);
    }
    async getTotal(...extraParams) {
        var _a;
        return (_a = this._cache.getTotal(...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getTotal(...extraParams);
    }
    async getStabilityDeposit(address, ...extraParams) {
        var _a;
        return ((_a = this._cache.getStabilityDeposit(address, ...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getStabilityDeposit(address, ...extraParams));
    }
    async getLUSDInStabilityPool(...extraParams) {
        var _a;
        return ((_a = this._cache.getLUSDInStabilityPool(...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getLUSDInStabilityPool(...extraParams));
    }
    async getLUSDBalance(address, ...extraParams) {
        var _a;
        return ((_a = this._cache.getLUSDBalance(address, ...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getLUSDBalance(address, ...extraParams));
    }
    async getLQTYBalance(address, ...extraParams) {
        var _a;
        return ((_a = this._cache.getLQTYBalance(address, ...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getLQTYBalance(address, ...extraParams));
    }
    async getCollateralSurplusBalance(address, ...extraParams) {
        var _a;
        return ((_a = this._cache.getCollateralSurplusBalance(address, ...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getCollateralSurplusBalance(address, ...extraParams));
    }
    async getTroves(params, ...extraParams) {
        var _a;
        const { beforeRedistribution, ...restOfParams } = params;
        const [totalRedistributed, troves] = await Promise.all([
            beforeRedistribution ? undefined : this.getTotalRedistributed(...extraParams),
            (_a = this._cache.getTroves({ beforeRedistribution: true, ...restOfParams }, ...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getTroves({ beforeRedistribution: true, ...restOfParams }, ...extraParams)
        ]);
        if (totalRedistributed) {
            return troves.map(trove => trove.applyRedistribution(totalRedistributed));
        }
        else {
            return troves;
        }
    }
    async _getFeesInNormalMode(...extraParams) {
        var _a;
        return ((_a = this._cache._getFeesInNormalMode(...extraParams)) !== null && _a !== void 0 ? _a : this._readable._getFeesInNormalMode(...extraParams));
    }
    async getFees(...extraParams) {
        const [feesInNormalMode, total, price] = await Promise.all([
            this._getFeesInNormalMode(...extraParams),
            this.getTotal(...extraParams),
            this.getPrice(...extraParams)
        ]);
        return feesInNormalMode._setRecoveryMode(total.collateralRatioIsBelowCritical(price));
    }
    async getLQTYStake(address, ...extraParams) {
        var _a;
        return ((_a = this._cache.getLQTYStake(address, ...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getLQTYStake(address, ...extraParams));
    }
    async getTotalStakedLQTY(...extraParams) {
        var _a;
        return ((_a = this._cache.getTotalStakedLQTY(...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getTotalStakedLQTY(...extraParams));
    }
    async getFrontendStatus(address, ...extraParams) {
        var _a;
        return ((_a = this._cache.getFrontendStatus(address, ...extraParams)) !== null && _a !== void 0 ? _a : this._readable.getFrontendStatus(address, ...extraParams));
    }
}
exports._CachedReadableLiquity = _CachedReadableLiquity;
//# sourceMappingURL=_CachedReadableLiquity.js.map