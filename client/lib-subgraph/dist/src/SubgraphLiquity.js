"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubgraphLiquity = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const client_1 = require("@apollo/client");
const address_1 = require("@ethersproject/address");
const lib_base_1 = require("@liquity/lib-base");
const globalTypes_1 = require("../types/globalTypes");
const Query_1 = require("./Query");
const normalizeAddress = (address) => {
    if (address === undefined) {
        throw new Error("An address is required");
    }
    return address.toLowerCase();
};
const decimalify = (bigNumberString) => lib_base_1.Decimal.fromBigNumberString(bigNumberString);
const queryGlobal = client_1.gql `
  query Global {
    global(id: "only") {
      id
      numberOfOpenTroves
      rawTotalRedistributedCollateral
      rawTotalRedistributedDebt

      currentSystemState {
        id
        price
        totalCollateral
        totalDebt
        tokensInStabilityPool
      }
    }
  }
`;
const numberOfTroves = new Query_1.Query(queryGlobal, ({ data: { global } }) => { var _a; return (_a = global === null || global === void 0 ? void 0 : global.numberOfOpenTroves) !== null && _a !== void 0 ? _a : 0; });
const totalRedistributed = new Query_1.Query(queryGlobal, ({ data: { global } }) => {
    if (global) {
        const { rawTotalRedistributedCollateral, rawTotalRedistributedDebt } = global;
        return new lib_base_1.Trove(decimalify(rawTotalRedistributedCollateral), decimalify(rawTotalRedistributedDebt));
    }
    else {
        return lib_base_1._emptyTrove;
    }
});
const price = new Query_1.Query(queryGlobal, ({ data: { global } }) => { var _a, _b; return lib_base_1.Decimal.from((_b = (_a = global === null || global === void 0 ? void 0 : global.currentSystemState) === null || _a === void 0 ? void 0 : _a.price) !== null && _b !== void 0 ? _b : 200); });
const total = new Query_1.Query(queryGlobal, ({ data: { global } }) => {
    if (global === null || global === void 0 ? void 0 : global.currentSystemState) {
        const { totalCollateral, totalDebt } = global.currentSystemState;
        return new lib_base_1.Trove(totalCollateral, totalDebt);
    }
    else {
        return lib_base_1._emptyTrove;
    }
});
const tokensInStabilityPool = new Query_1.Query(queryGlobal, ({ data: { global } }) => { var _a, _b; return lib_base_1.Decimal.from((_b = (_a = global === null || global === void 0 ? void 0 : global.currentSystemState) === null || _a === void 0 ? void 0 : _a.tokensInStabilityPool) !== null && _b !== void 0 ? _b : 0); });
const troveRawFields = client_1.gql `
  fragment TroveRawFields on Trove {
    owner {
      id
    }
    status
    rawCollateral
    rawDebt
    rawStake
    rawSnapshotOfTotalRedistributedCollateral
    rawSnapshotOfTotalRedistributedDebt
  }
`;
const troveFromRawFields = ({ owner: { id: ownerAddress }, status, rawCollateral, rawDebt, rawStake, rawSnapshotOfTotalRedistributedCollateral, rawSnapshotOfTotalRedistributedDebt }) => new lib_base_1.TroveWithPendingRedistribution(address_1.getAddress(ownerAddress), status, decimalify(rawCollateral), decimalify(rawDebt), decimalify(rawStake), new lib_base_1.Trove(decimalify(rawSnapshotOfTotalRedistributedCollateral), decimalify(rawSnapshotOfTotalRedistributedDebt)));
const troveBeforeRedistribution = new Query_1.Query(client_1.gql `
    query TroveWithoutRewards($address: ID!) {
      user(id: $address) {
        id
        currentTrove {
          id
          ...TroveRawFields
        }
      }
    }
    ${troveRawFields}
  `, ({ data: { user } }, { address }) => {
    if (user === null || user === void 0 ? void 0 : user.currentTrove) {
        return troveFromRawFields(user.currentTrove);
    }
    else {
        return new lib_base_1.TroveWithPendingRedistribution(address, "nonExistent");
    }
});
const troves = new Query_1.Query(client_1.gql `
    query Troves($orderDirection: OrderDirection!, $startingAt: Int!, $first: Int!) {
      troves(
        where: { status: open }
        orderBy: collateralRatioSortKey
        orderDirection: $orderDirection
        skip: $startingAt
        first: $first
      ) {
        id
        ...TroveRawFields
      }
    }
    ${troveRawFields}
  `, ({ data: { troves } }) => troves.map(trove => troveFromRawFields(trove)));
const blockNumberDummy = new Query_1.Query(client_1.gql `
    query BlockNumberDummy($blockNumber: Int!) {
      globals(block: { number: $blockNumber }) {
        id
      }
    }
  `, () => { });
class SubgraphLiquity {
    constructor(uri = "http://localhost:8000/subgraphs/name/liquity/subgraph", pollInterval = 4000) {
        this.client = new client_1.ApolloClient({
            cache: new client_1.InMemoryCache(),
            link: new client_1.HttpLink({ fetch: cross_fetch_1.default, uri }),
            defaultOptions: {
                query: { fetchPolicy: "network-only" },
                watchQuery: { fetchPolicy: "network-only", pollInterval }
            }
        });
    }
    getTotalRedistributed() {
        return totalRedistributed.get(this.client, undefined);
    }
    watchTotalRedistributed(onTotalRedistributedChanged) {
        return totalRedistributed.watch(this.client, onTotalRedistributedChanged, undefined);
    }
    getTroveBeforeRedistribution(address) {
        return troveBeforeRedistribution.get(this.client, { address: normalizeAddress(address) });
    }
    watchTroveWithoutRewards(onTroveChanged, address) {
        return troveBeforeRedistribution.watch(this.client, onTroveChanged, {
            address: normalizeAddress(address)
        });
    }
    async getTrove(address) {
        const [trove, totalRedistributed] = await Promise.all([
            this.getTroveBeforeRedistribution(address),
            this.getTotalRedistributed()
        ]);
        return trove.applyRedistribution(totalRedistributed);
    }
    getNumberOfTroves() {
        return numberOfTroves.get(this.client, undefined);
    }
    watchNumberOfTroves(onNumberOfTrovesChanged) {
        return numberOfTroves.watch(this.client, onNumberOfTrovesChanged, undefined);
    }
    getPrice() {
        return price.get(this.client, undefined);
    }
    watchPrice(onPriceChanged) {
        return price.watch(this.client, onPriceChanged, undefined);
    }
    getTotal() {
        return total.get(this.client, undefined);
    }
    watchTotal(onTotalChanged) {
        return total.watch(this.client, onTotalChanged, undefined);
    }
    getStabilityDeposit(address) {
        throw new Error("Method not implemented.");
    }
    watchStabilityDeposit(onStabilityDepositChanged, address) {
        throw new Error("Method not implemented.");
    }
    getLUSDInStabilityPool() {
        return tokensInStabilityPool.get(this.client, undefined);
    }
    watchLUSDInStabilityPool(onLUSDInStabilityPoolChanged) {
        return tokensInStabilityPool.watch(this.client, onLUSDInStabilityPoolChanged, undefined);
    }
    getLUSDBalance(address) {
        throw new Error("Method not implemented.");
    }
    watchLUSDBalance(onLUSDBalanceChanged, address) {
        throw new Error("Method not implemented.");
    }
    getLQTYBalance(address) {
        throw new Error("Method not implemented.");
    }
    getCollateralSurplusBalance(address) {
        throw new Error("Method not implemented.");
    }
    async getTroves(params) {
        const { first, sortedBy, startingAt = 0, beforeRedistribution } = params;
        const [totalRedistributed, _troves] = await Promise.all([
            beforeRedistribution ? undefined : this.getTotalRedistributed(),
            troves.get(this.client, {
                first,
                startingAt,
                orderDirection: sortedBy === "ascendingCollateralRatio" ? globalTypes_1.OrderDirection.asc : globalTypes_1.OrderDirection.desc
            })
        ]);
        if (totalRedistributed) {
            return _troves.map(trove => trove.applyRedistribution(totalRedistributed));
        }
        else {
            return _troves;
        }
    }
    async waitForBlock(blockNumber) {
        for (;;) {
            try {
                await blockNumberDummy.get(this.client, { blockNumber });
            }
            catch {
                await new Promise(resolve => setTimeout(resolve, 100));
                continue;
            }
            return;
        }
    }
    _getFeesInNormalMode() {
        throw new Error("Method not implemented.");
    }
    getFees() {
        throw new Error("Method not implemented.");
    }
    getLQTYStake(address) {
        throw new Error("Method not implemented.");
    }
    getTotalStakedLQTY() {
        throw new Error("Method not implemented.");
    }
    getFrontendStatus(address) {
        throw new Error("Method not implemented.");
    }
}
exports.SubgraphLiquity = SubgraphLiquity;
//# sourceMappingURL=SubgraphLiquity.js.map