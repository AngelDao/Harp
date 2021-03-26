"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLiquityStore = void 0;
const react_1 = require("react");
const LiquityStoreProvider_1 = require("../components/LiquityStoreProvider");
const useLiquityStore = () => {
    const store = react_1.useContext(LiquityStoreProvider_1.LiquityStoreContext);
    if (!store) {
        throw new Error("You must provide a LiquityStore via LiquityStoreProvider");
    }
    return store;
};
exports.useLiquityStore = useLiquityStore;
//# sourceMappingURL=useLiquityStore.js.map