"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
class Query {
    constructor(query, mapResult) {
        this.query = query;
        this.mapResult = mapResult;
    }
    get(client, variables) {
        return client
            .query({ query: this.query, variables })
            .then(result => this.mapResult(result, variables));
    }
    watch(client, onChanged, variables) {
        const subscription = client
            .watchQuery({ query: this.query, variables })
            .subscribe(result => onChanged(this.mapResult(result, variables)));
        return () => subscription.unsubscribe();
    }
}
exports.Query = Query;
//# sourceMappingURL=Query.js.map