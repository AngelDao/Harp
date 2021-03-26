import { Decimal, Decimalish } from "./Decimal";
/**
 * Represents the change between two states of an LQTY Stake.
 *
 * @public
 */
export declare type LQTYStakeChange<T> = {
    stakeLQTY: T;
    unstakeLQTY?: undefined;
} | {
    stakeLQTY?: undefined;
    unstakeLQTY: T;
    unstakeAllLQTY: boolean;
};
/**
 * Represents a user's LQTY stake and accrued gains.
 *
 * @remarks
 * Returned by the {@link ReadableLiquity.getLQTYStake | getLQTYStake()} function.

 * @public
 */
export declare class LQTYStake {
    /** The amount of LQTY that's staked. */
    readonly stakedLQTY: Decimal;
    /** Collateral gain available to withdraw. */
    readonly collateralGain: Decimal;
    /** LUSD gain available to withdraw. */
    readonly lusdGain: Decimal;
    /** @internal */
    constructor(stakedLQTY?: Decimal, collateralGain?: Decimal, lusdGain?: Decimal);
    get isEmpty(): boolean;
    /** @internal */
    toString(): string;
    /**
     * Compare to another instance of `LQTYStake`.
     */
    equals(that: LQTYStake): boolean;
    /**
     * Calculate the difference between this `LQTYStake` and `thatStakedLQTY`.
     *
     * @returns An object representing the change, or `undefined` if the staked amounts are equal.
     */
    whatChanged(thatStakedLQTY: Decimalish): LQTYStakeChange<Decimal> | undefined;
    /**
     * Apply a {@link LQTYStakeChange} to this `LQTYStake`.
     *
     * @returns The new staked LQTY amount.
     */
    apply(change: LQTYStakeChange<Decimalish> | undefined): Decimal;
}
//# sourceMappingURL=LQTYStake.d.ts.map