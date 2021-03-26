import { LiquityStore } from "@liquity/lib-base";
import React from "react";
export declare const LiquityStoreContext: React.Context<LiquityStore<unknown> | undefined>;
declare type LiquityStoreProviderProps = {
    store: LiquityStore;
    loader?: React.ReactNode;
};
export declare const LiquityStoreProvider: React.FC<LiquityStoreProviderProps>;
export {};
//# sourceMappingURL=LiquityStoreProvider.d.ts.map