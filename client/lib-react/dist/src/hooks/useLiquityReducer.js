"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLiquityReducer = void 0;
const react_1 = require("react");
const equals_1 = require("../utils/equals");
const useLiquityStore_1 = require("./useLiquityStore");
const useLiquityReducer = (reduce, init) => {
    const store = useLiquityStore_1.useLiquityStore();
    const oldStore = react_1.useRef(store);
    const state = react_1.useRef(init(store.state));
    const [, rerender] = react_1.useReducer(() => ({}), {});
    const dispatch = react_1.useCallback((action) => {
        const newState = reduce(state.current, action);
        if (!equals_1.equals(newState, state.current)) {
            state.current = newState;
            rerender();
        }
    }, [reduce]);
    react_1.useEffect(() => store.subscribe(params => dispatch({ type: "updateStore", ...params })), [
        store,
        dispatch
    ]);
    if (oldStore.current !== store) {
        state.current = init(store.state);
        oldStore.current = store;
    }
    return [state.current, dispatch];
};
exports.useLiquityReducer = useLiquityReducer;
//# sourceMappingURL=useLiquityReducer.js.map