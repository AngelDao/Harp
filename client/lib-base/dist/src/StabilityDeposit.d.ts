import { Decimal, Decimalish } from "./Decimal";
/**
 * Represents the change between two Stability Deposit states.
 *
 * @public
 */
export declare type StabilityDepositChange<T> = {
    depositLUSD: T;
    withdrawLUSD?: undefined;
} | {
    depositLUSD?: undefined;
    withdrawLUSD: T;
    withdrawAllLUSD: boolean;
};
/**
 * A Stability Deposit and its accrued gains.
 *
 * @public
 */
export declare class StabilityDeposit {
    /** Amount of LUSD in the Stability Deposit at the time of the last direct modification. */
    readonly initialLUSD: Decimal;
    /** Amount of LUSD left in the Stability Deposit. */
    readonly currentLUSD: Decimal;
    /** Amount of native currency (e.g. Ether) received in exchange for the used-up LUSD. */
    readonly collateralGain: Decimal;
    /** Amount of LQTY rewarded since the last modification of the Stability Deposit. */
    readonly lqtyReward: Decimal;
    /** @internal */
    constructor(initialLUSD?: Decimal, currentLUSD?: Decimal, collateralGain?: Decimal, lqtyReward?: Decimal);
    get isEmpty(): boolean;
    /** @internal */
    toString(): string;
    /**
     * Compare to another instance of `StabilityDeposit`.
     */
    equals(that: StabilityDeposit): boolean;
    /**
     * Calculate the difference between the `currentLUSD` in this Stability Deposit and `thatLUSD`.
     *
     * @returns An object representing the change, or `undefined` if the deposited amounts are equal.
     */
    whatChanged(thatLUSD: Decimalish): StabilityDepositChange<Decimal> | undefined;
    /**
     * Apply a {@link StabilityDepositChange} to this Stability Deposit.
     *
     * @returns The new deposited LUSD amount.
     */
    apply(change: StabilityDepositChange<Decimalish> | undefined): Decimal;
}
//# sourceMappingURL=StabilityDeposit.d.ts.map