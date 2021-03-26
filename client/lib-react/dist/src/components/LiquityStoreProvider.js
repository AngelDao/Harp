"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquityStoreProvider = exports.LiquityStoreContext = void 0;
const react_1 = __importStar(require("react"));
exports.LiquityStoreContext = react_1.createContext(undefined);
const LiquityStoreProvider = ({ store, loader, children }) => {
    const [loadedStore, setLoadedStore] = react_1.useState();
    react_1.useEffect(() => {
        store.onLoaded = () => setLoadedStore(store);
        const stop = store.start();
        return () => {
            store.onLoaded = undefined;
            setLoadedStore(undefined);
            stop();
        };
    }, [store]);
    if (!loadedStore) {
        return react_1.default.createElement(react_1.default.Fragment, null, loader);
    }
    return react_1.default.createElement(exports.LiquityStoreContext.Provider, { value: loadedStore }, children);
};
exports.LiquityStoreProvider = LiquityStoreProvider;
//# sourceMappingURL=LiquityStoreProvider.js.map