import { CollateralGainTransferDetails, Decimalish, LiquidationDetails, RedemptionDetails, SendableLiquity, StabilityDepositChangeDetails, StabilityPoolGainsWithdrawalDetails, TroveAdjustmentDetails, TroveAdjustmentParams, TroveClosureDetails, TroveCreationDetails, TroveCreationParams } from "@liquity/lib-base";
import { EthersTransactionOverrides, EthersTransactionReceipt, EthersTransactionResponse } from "./types";
import { PopulatableEthersLiquity, SentEthersLiquityTransaction } from "./PopulatableEthersLiquity";
/**
 * Ethers-based implementation of {@link @liquity/lib-base#SendableLiquity}.
 *
 * @public
 */
export declare class SendableEthersLiquity implements SendableLiquity<EthersTransactionReceipt, EthersTransactionResponse> {
    private _populate;
    constructor(populatable: PopulatableEthersLiquity);
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.openTrove} */
    openTrove(params: TroveCreationParams<Decimalish>, maxBorrowingRate?: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<TroveCreationDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.closeTrove} */
    closeTrove(overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<TroveClosureDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.adjustTrove} */
    adjustTrove(params: TroveAdjustmentParams<Decimalish>, maxBorrowingRate?: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<TroveAdjustmentDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.depositCollateral} */
    depositCollateral(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<TroveAdjustmentDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawCollateral} */
    withdrawCollateral(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<TroveAdjustmentDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.borrowLUSD} */
    borrowLUSD(amount: Decimalish, maxBorrowingRate?: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<TroveAdjustmentDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.repayLUSD} */
    repayLUSD(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<TroveAdjustmentDetails>>;
    /** @internal */
    setPrice(price: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<void>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.liquidate} */
    liquidate(address: string | string[], overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<LiquidationDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.liquidateUpTo} */
    liquidateUpTo(maximumNumberOfTrovesToLiquidate: number, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<LiquidationDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.depositLUSDInStabilityPool} */
    depositLUSDInStabilityPool(amount: Decimalish, frontendTag?: string, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<StabilityDepositChangeDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawLUSDFromStabilityPool} */
    withdrawLUSDFromStabilityPool(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<StabilityDepositChangeDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawGainsFromStabilityPool} */
    withdrawGainsFromStabilityPool(overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<StabilityPoolGainsWithdrawalDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.transferCollateralGainToTrove} */
    transferCollateralGainToTrove(overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<CollateralGainTransferDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.sendLUSD} */
    sendLUSD(toAddress: string, amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<void>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.sendLQTY} */
    sendLQTY(toAddress: string, amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<void>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.redeemLUSD} */
    redeemLUSD(amount: Decimalish, maxRedemptionRate?: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<RedemptionDetails>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.claimCollateralSurplus} */
    claimCollateralSurplus(overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<void>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.stakeLQTY} */
    stakeLQTY(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<void>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.unstakeLQTY} */
    unstakeLQTY(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<void>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.withdrawGainsFromStaking} */
    withdrawGainsFromStaking(overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<void>>;
    /** {@inheritDoc @liquity/lib-base#SendableLiquity.registerFrontend} */
    registerFrontend(kickbackRate: Decimalish, overrides?: EthersTransactionOverrides): Promise<SentEthersLiquityTransaction<void>>;
}
//# sourceMappingURL=SendableEthersLiquity.d.ts.map