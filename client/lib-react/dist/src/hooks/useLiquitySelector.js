"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLiquitySelector = void 0;
const react_1 = require("react");
const equals_1 = require("../utils/equals");
const useLiquityStore_1 = require("./useLiquityStore");
const useLiquitySelector = (select) => {
    const store = useLiquityStore_1.useLiquityStore();
    const [, rerender] = react_1.useReducer(() => ({}), {});
    react_1.useEffect(() => store.subscribe(({ newState, oldState }) => {
        if (!equals_1.equals(select(newState), select(oldState))) {
            rerender();
        }
    }), [store, select]);
    return select(store.state);
};
exports.useLiquitySelector = useLiquitySelector;
//# sourceMappingURL=useLiquitySelector.js.map