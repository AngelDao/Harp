import { Decimal } from "./Decimal";
import { Fees } from "./Fees";
import { LQTYStake } from "./LQTYStake";
import { StabilityDeposit } from "./StabilityDeposit";
import { Trove, TroveWithPendingRedistribution, UserTrove } from "./Trove";
import { FrontendStatus, ReadableLiquity, TroveListingParams } from "./ReadableLiquity";
/** @internal */
export declare type _ReadableLiquityWithExtraParamsBase<T extends unknown[]> = {
    [P in keyof ReadableLiquity]: ReadableLiquity[P] extends (...params: infer A) => infer R ? (...params: [...originalParams: A, ...extraParams: T]) => R : never;
};
/** @internal */
export declare type _LiquityReadCacheBase<T extends unknown[]> = {
    [P in keyof ReadableLiquity]: ReadableLiquity[P] extends (...args: infer A) => Promise<infer R> ? (...params: [...originalParams: A, ...extraParams: T]) => R | undefined : never;
};
/** @internal */
export interface _ReadableLiquityWithExtraParams<T extends unknown[]> extends _ReadableLiquityWithExtraParamsBase<T> {
    getTroves(params: TroveListingParams & {
        beforeRedistribution: true;
    }, ...extraParams: T): Promise<TroveWithPendingRedistribution[]>;
    getTroves(params: TroveListingParams, ...extraParams: T): Promise<UserTrove[]>;
}
/** @internal */
export interface _LiquityReadCache<T extends unknown[]> extends _LiquityReadCacheBase<T> {
    getTroves(params: TroveListingParams & {
        beforeRedistribution: true;
    }, ...extraParams: T): TroveWithPendingRedistribution[] | undefined;
    getTroves(params: TroveListingParams, ...extraParams: T): UserTrove[] | undefined;
}
/** @internal */
export declare class _CachedReadableLiquity<T extends unknown[]> implements _ReadableLiquityWithExtraParams<T> {
    private _readable;
    private _cache;
    constructor(readable: _ReadableLiquityWithExtraParams<T>, cache: _LiquityReadCache<T>);
    getTotalRedistributed(...extraParams: T): Promise<Trove>;
    getTroveBeforeRedistribution(address?: string, ...extraParams: T): Promise<TroveWithPendingRedistribution>;
    getTrove(address?: string, ...extraParams: T): Promise<UserTrove>;
    getNumberOfTroves(...extraParams: T): Promise<number>;
    getPrice(...extraParams: T): Promise<Decimal>;
    getTotal(...extraParams: T): Promise<Trove>;
    getStabilityDeposit(address?: string, ...extraParams: T): Promise<StabilityDeposit>;
    getLUSDInStabilityPool(...extraParams: T): Promise<Decimal>;
    getLUSDBalance(address?: string, ...extraParams: T): Promise<Decimal>;
    getLQTYBalance(address?: string, ...extraParams: T): Promise<Decimal>;
    getCollateralSurplusBalance(address?: string, ...extraParams: T): Promise<Decimal>;
    getTroves(params: TroveListingParams & {
        beforeRedistribution: true;
    }, ...extraParams: T): Promise<TroveWithPendingRedistribution[]>;
    getTroves(params: TroveListingParams, ...extraParams: T): Promise<UserTrove[]>;
    _getFeesInNormalMode(...extraParams: T): Promise<Fees>;
    getFees(...extraParams: T): Promise<Fees>;
    getLQTYStake(address?: string, ...extraParams: T): Promise<LQTYStake>;
    getTotalStakedLQTY(...extraParams: T): Promise<Decimal>;
    getFrontendStatus(address?: string, ...extraParams: T): Promise<FrontendStatus>;
}
//# sourceMappingURL=_CachedReadableLiquity.d.ts.map