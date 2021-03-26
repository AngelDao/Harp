"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StabilityDeposit = void 0;
const Decimal_1 = require("./Decimal");
/**
 * A Stability Deposit and its accrued gains.
 *
 * @public
 */
class StabilityDeposit {
    /** @internal */
    constructor(initialLUSD = Decimal_1.Decimal.ZERO, currentLUSD = initialLUSD, collateralGain = Decimal_1.Decimal.ZERO, lqtyReward = Decimal_1.Decimal.ZERO) {
        this.initialLUSD = initialLUSD;
        this.currentLUSD = currentLUSD;
        this.collateralGain = collateralGain;
        this.lqtyReward = lqtyReward;
        if (this.currentLUSD.gt(this.initialLUSD)) {
            throw new Error("currentLUSD can't be greater than initialLUSD");
        }
    }
    get isEmpty() {
        return (this.initialLUSD.isZero &&
            this.currentLUSD.isZero &&
            this.collateralGain.isZero &&
            this.lqtyReward.isZero);
    }
    /** @internal */
    toString() {
        return (`{ initialLUSD: ${this.initialLUSD}` +
            `, currentLUSD: ${this.currentLUSD}` +
            `, collateralGain: ${this.collateralGain}` +
            `, lqtyReward: ${this.lqtyReward} }`);
    }
    /**
     * Compare to another instance of `StabilityDeposit`.
     */
    equals(that) {
        return (this.initialLUSD.eq(that.initialLUSD) &&
            this.currentLUSD.eq(that.currentLUSD) &&
            this.collateralGain.eq(that.collateralGain) &&
            this.lqtyReward.eq(that.lqtyReward));
    }
    /**
     * Calculate the difference between the `currentLUSD` in this Stability Deposit and `thatLUSD`.
     *
     * @returns An object representing the change, or `undefined` if the deposited amounts are equal.
     */
    whatChanged(thatLUSD) {
        thatLUSD = Decimal_1.Decimal.from(thatLUSD);
        if (thatLUSD.lt(this.currentLUSD)) {
            return { withdrawLUSD: this.currentLUSD.sub(thatLUSD), withdrawAllLUSD: thatLUSD.isZero };
        }
        if (thatLUSD.gt(this.currentLUSD)) {
            return { depositLUSD: thatLUSD.sub(this.currentLUSD) };
        }
    }
    /**
     * Apply a {@link StabilityDepositChange} to this Stability Deposit.
     *
     * @returns The new deposited LUSD amount.
     */
    apply(change) {
        if (!change) {
            return this.currentLUSD;
        }
        if (change.withdrawLUSD !== undefined) {
            return change.withdrawAllLUSD || this.currentLUSD.lte(change.withdrawLUSD)
                ? Decimal_1.Decimal.ZERO
                : this.currentLUSD.sub(change.withdrawLUSD);
        }
        else {
            return this.currentLUSD.add(change.depositLUSD);
        }
    }
}
exports.StabilityDeposit = StabilityDeposit;
//# sourceMappingURL=StabilityDeposit.js.map