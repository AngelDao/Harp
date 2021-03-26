"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LQTYStake = void 0;
const Decimal_1 = require("./Decimal");
/**
 * Represents a user's LQTY stake and accrued gains.
 *
 * @remarks
 * Returned by the {@link ReadableLiquity.getLQTYStake | getLQTYStake()} function.

 * @public
 */
class LQTYStake {
    /** @internal */
    constructor(stakedLQTY = Decimal_1.Decimal.ZERO, collateralGain = Decimal_1.Decimal.ZERO, lusdGain = Decimal_1.Decimal.ZERO) {
        this.stakedLQTY = stakedLQTY;
        this.collateralGain = collateralGain;
        this.lusdGain = lusdGain;
    }
    get isEmpty() {
        return this.stakedLQTY.isZero && this.collateralGain.isZero && this.lusdGain.isZero;
    }
    /** @internal */
    toString() {
        return (`{ stakedLQTY: ${this.stakedLQTY}` +
            `, collateralGain: ${this.collateralGain}` +
            `, lusdGain: ${this.lusdGain} }`);
    }
    /**
     * Compare to another instance of `LQTYStake`.
     */
    equals(that) {
        return (this.stakedLQTY.eq(that.stakedLQTY) &&
            this.collateralGain.eq(that.collateralGain) &&
            this.lusdGain.eq(that.lusdGain));
    }
    /**
     * Calculate the difference between this `LQTYStake` and `thatStakedLQTY`.
     *
     * @returns An object representing the change, or `undefined` if the staked amounts are equal.
     */
    whatChanged(thatStakedLQTY) {
        thatStakedLQTY = Decimal_1.Decimal.from(thatStakedLQTY);
        if (thatStakedLQTY.lt(this.stakedLQTY)) {
            return {
                unstakeLQTY: this.stakedLQTY.sub(thatStakedLQTY),
                unstakeAllLQTY: thatStakedLQTY.isZero
            };
        }
        if (thatStakedLQTY.gt(this.stakedLQTY)) {
            return { stakeLQTY: thatStakedLQTY.sub(this.stakedLQTY) };
        }
    }
    /**
     * Apply a {@link LQTYStakeChange} to this `LQTYStake`.
     *
     * @returns The new staked LQTY amount.
     */
    apply(change) {
        if (!change) {
            return this.stakedLQTY;
        }
        if (change.unstakeLQTY !== undefined) {
            return change.unstakeAllLQTY || this.stakedLQTY.lte(change.unstakeLQTY)
                ? Decimal_1.Decimal.ZERO
                : this.stakedLQTY.sub(change.unstakeLQTY);
        }
        else {
            return this.stakedLQTY.add(change.stakeLQTY);
        }
    }
}
exports.LQTYStake = LQTYStake;
//# sourceMappingURL=LQTYStake.js.map