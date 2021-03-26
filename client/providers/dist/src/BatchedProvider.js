"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchedWebSocketAugmentedWeb3Provider = exports.Batched = exports.isBatchedProvider = void 0;
const contracts_1 = require("@ethersproject/contracts");
const properties_1 = require("@ethersproject/properties");
const WebSocketAugmentedProvider_1 = require("./WebSocketAugmentedProvider");
const devDeployment_json_1 = __importDefault(require("../devDeployment.json"));
const devOrNull = devDeployment_json_1.default;
const multiCallerAddressOnChain = {
    3: "0xdDB3aEa04Ac270880df386479850669C77b59E11",
    4: "0x32C223BF623816e7AF33cDb5B4937fae948cA7F6",
    5: "0xB845bF75bc3BC73beEFf5451a7a724CF552BDF7C",
    42: "0xaEcb9EA73E58814728b42E7C3AA00073F52acC7F",
    ...(devOrNull !== null ? { [devOrNull.chainId]: devOrNull.address } : {})
};
const multiCallerAbi = [
    {
        type: "function",
        name: "performMultiple",
        stateMutability: "view",
        inputs: [
            {
                type: "tuple[]",
                name: "calls",
                components: [
                    {
                        type: "address",
                        name: "to"
                    },
                    {
                        type: "bytes",
                        name: "data"
                    }
                ]
            }
        ],
        outputs: [
            {
                type: "bytes[]",
                name: "results"
            }
        ]
    }
];
const emptyBatch = () => ({ calls: [], callbacks: [] });
const batchableCall = (request) => request.gasLimit === undefined && request.gasPrice === undefined && request.value === undefined;
const batchedProviders = [];
const isBatchedProvider = (provider) => batchedProviders.some(batchedProvider => provider instanceof batchedProvider);
exports.isBatchedProvider = isBatchedProvider;
const Batched = (Base) => {
    const batchedProvider = class extends Base {
        constructor() {
            super(...arguments);
            this.batchingDelayMs = 10;
            this._chainId = 0;
            this._batched = emptyBatch();
            this._numberOfBatchedCalls = 0;
            this._numberOfActualCalls = 0;
        }
        get chainId() {
            return this._chainId;
        }
        set chainId(chainId) {
            if (this._multiCaller) {
                throw new Error("can only set chainId once");
            }
            if (chainId in multiCallerAddressOnChain) {
                this._multiCaller = new contracts_1.Contract(multiCallerAddressOnChain[chainId], multiCallerAbi, this);
            }
            this._chainId = chainId;
        }
        async _dispatchCalls() {
            const { calls, callbacks, from, blockTag } = this._batched;
            this._batched = emptyBatch();
            try {
                const results = calls.length > 1
                    ? await this._multiCaller.performMultiple(calls, { from, blockTag })
                    : [await super.call({ from, to: calls[0].to, data: calls[0].data }, blockTag)];
                callbacks.forEach(([resolve], i) => resolve(results[i]));
            }
            catch (error) {
                callbacks.forEach(([, reject]) => reject(error));
            }
        }
        _enqueueCall(call) {
            if (this._timeoutId !== undefined) {
                clearTimeout(this._timeoutId);
            }
            this._timeoutId = setTimeout(() => this._dispatchCalls(), this.batchingDelayMs);
            this._batched.calls.push(call);
            return new Promise((resolve, reject) => this._batched.callbacks.push([resolve, reject]));
        }
        _alreadyBatchedCallsConflictWith(request, blockTag) {
            if (this._batched.calls.length === 0) {
                return false;
            }
            return request.from !== this._batched.from || blockTag !== this._batched.blockTag;
        }
        async call(request, blockTag) {
            if (!this._multiCaller) {
                return super.call(request, blockTag);
            }
            else {
                const now = new Date().getTime();
                if (this._timeOfLastRatioCheck === undefined) {
                    this._timeOfLastRatioCheck = now;
                }
                else {
                    const timeSinceLastRatioCheck = now - this._timeOfLastRatioCheck;
                    if (timeSinceLastRatioCheck >= 10000 && this._numberOfActualCalls) {
                        // console.log(
                        //   `Call batching ratio: ${
                        //     Math.round((10 * this._numberOfBatchedCalls) / this._numberOfActualCalls) / 10
                        //   }X`
                        // );
                        this._numberOfBatchedCalls = 0;
                        this._numberOfActualCalls = 0;
                        this._timeOfLastRatioCheck = now;
                    }
                }
            }
            const [resolvedRequest, resolvedBlockTag] = await Promise.all([
                properties_1.resolveProperties(request),
                blockTag
            ]);
            if (resolvedRequest.to === this._multiCaller.address ||
                !batchableCall(resolvedRequest) ||
                this._alreadyBatchedCallsConflictWith(resolvedRequest, resolvedBlockTag)) {
                this._numberOfActualCalls++;
                return super.call(resolvedRequest, resolvedBlockTag);
            }
            else {
                this._numberOfBatchedCalls++;
                if (this._batched.calls.length === 0) {
                    this._batched.from = resolvedRequest.from;
                    this._batched.blockTag = resolvedBlockTag;
                }
                return this._enqueueCall({ to: resolvedRequest.to, data: resolvedRequest.data });
            }
        }
    };
    batchedProviders.push(batchedProvider);
    return batchedProvider;
};
exports.Batched = Batched;
exports.BatchedWebSocketAugmentedWeb3Provider = exports.Batched(WebSocketAugmentedProvider_1.WebSocketAugmentedWeb3Provider);
//# sourceMappingURL=BatchedProvider.js.map