import { WebSocketProvider as EthersWebSocketProvider } from "@ethersproject/providers";
export declare class WebSocketProvider extends EthersWebSocketProvider {
    get isReady(): boolean;
    set onClose(closeListener: ((closeEvent: CloseEvent) => void) | null);
    close(code?: number): void;
    detectNetwork(): Promise<import("@ethersproject/providers").Network>;
}
//# sourceMappingURL=WebSocketProvider.d.ts.map