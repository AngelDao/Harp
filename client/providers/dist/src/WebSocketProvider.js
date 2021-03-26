"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketProvider = void 0;
const providers_1 = require("@ethersproject/providers");
class WebSocketProvider extends providers_1.WebSocketProvider {
    get isReady() {
        return this._websocket.readyState === WebSocket.OPEN;
    }
    set onClose(closeListener) {
        this._websocket.onclose = closeListener;
    }
    close(code) {
        this._websocket.close(code);
    }
    async detectNetwork() {
        return this.network;
    }
}
exports.WebSocketProvider = WebSocketProvider;
//# sourceMappingURL=WebSocketProvider.js.map