"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendableEthersLiquity = void 0;
const sendTransaction = (tx) => tx.send();
/**
 * Ethers-based implementation of {@link @liquity/lib-base#SendableLiquity}.
 *
 * @public
 */
class SendableEthersLiquity {
    constructor(populatable) {
        this._populate = populatable;
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.openTrove} */
    openTrove(params, maxBorrowingRate, overrides) {
        return this._populate.openTrove(params, maxBorrowingRate, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.closeTrove} */
    closeTrove(overrides) {
        return this._populate.closeTrove(overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.adjustTrove} */
    adjustTrove(params, maxBorrowingRate, overrides) {
        return this._populate.adjustTrove(params, maxBorrowingRate, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.depositCollateral} */
    depositCollateral(amount, overrides) {
        return this._populate.depositCollateral(amount, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawCollateral} */
    withdrawCollateral(amount, overrides) {
        return this._populate.withdrawCollateral(amount, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.borrowLUSD} */
    borrowLUSD(amount, maxBorrowingRate, overrides) {
        return this._populate.borrowLUSD(amount, maxBorrowingRate, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.repayLUSD} */
    repayLUSD(amount, overrides) {
        return this._populate.repayLUSD(amount, overrides).then(sendTransaction);
    }
    /** @internal */
    setPrice(price, overrides) {
        return this._populate.setPrice(price, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.liquidate} */
    liquidate(address, overrides) {
        return this._populate.liquidate(address, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.liquidateUpTo} */
    liquidateUpTo(maximumNumberOfTrovesToLiquidate, overrides) {
        return this._populate
            .liquidateUpTo(maximumNumberOfTrovesToLiquidate, overrides)
            .then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.depositLUSDInStabilityPool} */
    depositLUSDInStabilityPool(amount, frontendTag, overrides) {
        return this._populate
            .depositLUSDInStabilityPool(amount, frontendTag, overrides)
            .then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawLUSDFromStabilityPool} */
    withdrawLUSDFromStabilityPool(amount, overrides) {
        return this._populate.withdrawLUSDFromStabilityPool(amount, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawGainsFromStabilityPool} */
    withdrawGainsFromStabilityPool(overrides) {
        return this._populate.withdrawGainsFromStabilityPool(overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.transferCollateralGainToTrove} */
    transferCollateralGainToTrove(overrides) {
        return this._populate.transferCollateralGainToTrove(overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.sendLUSD} */
    sendLUSD(toAddress, amount, overrides) {
        return this._populate.sendLUSD(toAddress, amount, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.sendLQTY} */
    sendLQTY(toAddress, amount, overrides) {
        return this._populate.sendLQTY(toAddress, amount, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.redeemLUSD} */
    redeemLUSD(amount, maxRedemptionRate, overrides) {
        return this._populate.redeemLUSD(amount, maxRedemptionRate, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.claimCollateralSurplus} */
    claimCollateralSurplus(overrides) {
        return this._populate.claimCollateralSurplus(overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.stakeLQTY} */
    stakeLQTY(amount, overrides) {
        return this._populate.stakeLQTY(amount, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.unstakeLQTY} */
    unstakeLQTY(amount, overrides) {
        return this._populate.unstakeLQTY(amount, overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawGainsFromStaking} */
    withdrawGainsFromStaking(overrides) {
        return this._populate.withdrawGainsFromStaking(overrides).then(sendTransaction);
    }
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.registerFrontend} */
    registerFrontend(kickbackRate, overrides) {
        return this._populate.registerFrontend(kickbackRate, overrides).then(sendTransaction);
    }
}
exports.SendableEthersLiquity = SendableEthersLiquity;
//# sourceMappingURL=SendableEthersLiquity.js.map