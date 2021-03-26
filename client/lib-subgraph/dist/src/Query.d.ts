import { ApolloClient, ApolloQueryResult, DocumentNode } from "@apollo/client";
export declare class Query<T, U, V = undefined> {
    private readonly query;
    private readonly mapResult;
    constructor(query: DocumentNode, mapResult: (result: ApolloQueryResult<U>, variables: V) => T);
    get(client: ApolloClient<unknown>, variables: V): Promise<T>;
    watch(client: ApolloClient<unknown>, onChanged: (value: T) => void, variables: V): () => void;
}
//# sourceMappingURL=Query.d.ts.map