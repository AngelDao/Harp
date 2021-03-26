import { Decimal, Fees, FrontendStatus, LiquityStore, LQTYStake, ReadableLiquity, StabilityDeposit, Trove, TroveListingParams, TroveWithPendingRedistribution, UserTrove } from "@liquity/lib-base";
import { EthersCallOverrides, EthersProvider, EthersSigner } from "./types";
import { EthersLiquityConnection, EthersLiquityConnectionOptionalParams } from "./EthersLiquityConnection";
import { BlockPolledLiquityStore } from "./BlockPolledLiquityStore";
/**
 * Ethers-based implementation of {@link @liquity/lib-base#ReadableLiquity}.
 *
 * @public
 */
export declare class ReadableEthersLiquity implements ReadableLiquity {
    readonly connection: EthersLiquityConnection;
    /** @internal */
    constructor(connection: EthersLiquityConnection);
    /** @internal */
    static _from(connection: EthersLiquityConnection & {
        useStore: "blockPolled";
    }): ReadableEthersLiquityWithStore<BlockPolledLiquityStore>;
    /** @internal */
    static _from(connection: EthersLiquityConnection): ReadableEthersLiquity;
    /** @internal */
    static connect(signerOrProvider: EthersSigner | EthersProvider, optionalParams: EthersLiquityConnectionOptionalParams & {
        useStore: "blockPolled";
    }): Promise<ReadableEthersLiquityWithStore<BlockPolledLiquityStore>>;
    static connect(signerOrProvider: EthersSigner | EthersProvider, optionalParams?: EthersLiquityConnectionOptionalParams): Promise<ReadableEthersLiquity>;
    /**
     * Check whether this `ReadableEthersLiquity` is a {@link ReadableEthersLiquityWithStore}.
     */
    hasStore(): this is ReadableEthersLiquityWithStore;
    /**
     * Check whether this `ReadableEthersLiquity` is a
     * {@link ReadableEthersLiquityWithStore}\<{@link BlockPolledLiquityStore}\>.
     */
    hasStore(store: "blockPolled"): this is ReadableEthersLiquityWithStore<BlockPolledLiquityStore>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotalRedistributed} */
    getTotalRedistributed(overrides?: EthersCallOverrides): Promise<Trove>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTroveBeforeRedistribution} */
    getTroveBeforeRedistribution(address?: string, overrides?: EthersCallOverrides): Promise<TroveWithPendingRedistribution>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTrove} */
    getTrove(address?: string, overrides?: EthersCallOverrides): Promise<UserTrove>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getNumberOfTroves} */
    getNumberOfTroves(overrides?: EthersCallOverrides): Promise<number>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getPrice} */
    getPrice(overrides?: EthersCallOverrides): Promise<Decimal>;
    /** @internal */
    _getActivePool(overrides?: EthersCallOverrides): Promise<Trove>;
    /** @internal */
    _getDefaultPool(overrides?: EthersCallOverrides): Promise<Trove>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotal} */
    getTotal(overrides?: EthersCallOverrides): Promise<Trove>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getStabilityDeposit} */
    getStabilityDeposit(address?: string, overrides?: EthersCallOverrides): Promise<StabilityDeposit>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLUSDInStabilityPool} */
    getLUSDInStabilityPool(overrides?: EthersCallOverrides): Promise<Decimal>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLUSDBalance} */
    getLUSDBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLQTYBalance} */
    getLQTYBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getCollateralSurplusBalance} */
    getCollateralSurplusBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal>;
    /** @internal */
    getTroves(params: TroveListingParams & {
        beforeRedistribution: true;
    }, overrides?: EthersCallOverrides): Promise<TroveWithPendingRedistribution[]>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.(getTroves:2)} */
    getTroves(params: TroveListingParams, overrides?: EthersCallOverrides): Promise<UserTrove[]>;
    /** @internal */
    _getFeesInNormalMode(overrides?: EthersCallOverrides): Promise<Fees>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getFees} */
    getFees(overrides?: EthersCallOverrides): Promise<Fees>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getLQTYStake} */
    getLQTYStake(address?: string, overrides?: EthersCallOverrides): Promise<LQTYStake>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getTotalStakedLQTY} */
    getTotalStakedLQTY(overrides?: EthersCallOverrides): Promise<Decimal>;
    /** {@inheritDoc @liquity/lib-base#ReadableLiquity.getFrontendStatus} */
    getFrontendStatus(address?: string, overrides?: EthersCallOverrides): Promise<FrontendStatus>;
}
/**
 * Variant of {@link ReadableEthersLiquity} that exposes a {@link @liquity/lib-base#LiquityStore}.
 *
 * @public
 */
export interface ReadableEthersLiquityWithStore<T extends LiquityStore = LiquityStore> extends ReadableEthersLiquity {
    /** An object that implements LiquityStore. */
    readonly store: T;
}
//# sourceMappingURL=ReadableEthersLiquity.d.ts.map