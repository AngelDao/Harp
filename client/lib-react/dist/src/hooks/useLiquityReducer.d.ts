import { LiquityStoreState } from "@liquity/lib-base";
export declare type LiquityStoreUpdate<T = unknown> = {
    type: "updateStore";
    newState: LiquityStoreState<T>;
    oldState: LiquityStoreState<T>;
    stateChange: Partial<LiquityStoreState<T>>;
};
export declare const useLiquityReducer: <S, A, T>(reduce: (state: S, action: A | LiquityStoreUpdate<T>) => S, init: (storeState: LiquityStoreState<T>) => S) => [S, (action: A | LiquityStoreUpdate<T>) => void];
//# sourceMappingURL=useLiquityReducer.d.ts.map