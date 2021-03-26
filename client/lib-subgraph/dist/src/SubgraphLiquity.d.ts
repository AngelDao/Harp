import { Decimal, Fees, FrontendStatus, LQTYStake, ObservableLiquity, ReadableLiquity, StabilityDeposit, Trove, TroveListingParams, TroveWithPendingRedistribution, UserTrove } from "@liquity/lib-base";
export declare class SubgraphLiquity implements ReadableLiquity, ObservableLiquity {
    private client;
    constructor(uri?: string, pollInterval?: number);
    getTotalRedistributed(): Promise<Trove>;
    watchTotalRedistributed(onTotalRedistributedChanged: (totalRedistributed: Trove) => void): () => void;
    getTroveBeforeRedistribution(address?: string): Promise<TroveWithPendingRedistribution>;
    watchTroveWithoutRewards(onTroveChanged: (trove: TroveWithPendingRedistribution) => void, address?: string): () => void;
    getTrove(address?: string): Promise<UserTrove>;
    getNumberOfTroves(): Promise<number>;
    watchNumberOfTroves(onNumberOfTrovesChanged: (numberOfTroves: number) => void): () => void;
    getPrice(): Promise<Decimal>;
    watchPrice(onPriceChanged: (price: Decimal) => void): () => void;
    getTotal(): Promise<Trove>;
    watchTotal(onTotalChanged: (total: Trove) => void): () => void;
    getStabilityDeposit(address?: string): Promise<StabilityDeposit>;
    watchStabilityDeposit(onStabilityDepositChanged: (stabilityDeposit: StabilityDeposit) => void, address?: string): () => void;
    getLUSDInStabilityPool(): Promise<Decimal>;
    watchLUSDInStabilityPool(onLUSDInStabilityPoolChanged: (lusdInStabilityPool: Decimal) => void): () => void;
    getLUSDBalance(address?: string): Promise<Decimal>;
    watchLUSDBalance(onLUSDBalanceChanged: (balance: Decimal) => void, address?: string): () => void;
    getLQTYBalance(address?: string): Promise<Decimal>;
    getCollateralSurplusBalance(address?: string): Promise<Decimal>;
    getTroves(params: TroveListingParams & {
        beforeRedistribution: true;
    }): Promise<TroveWithPendingRedistribution[]>;
    getTroves(params: TroveListingParams): Promise<UserTrove[]>;
    waitForBlock(blockNumber: number): Promise<void>;
    _getFeesInNormalMode(): Promise<Fees>;
    getFees(): Promise<Fees>;
    getLQTYStake(address?: string): Promise<LQTYStake>;
    getTotalStakedLQTY(): Promise<Decimal>;
    getFrontendStatus(address?: string): Promise<FrontendStatus>;
}
//# sourceMappingURL=SubgraphLiquity.d.ts.map