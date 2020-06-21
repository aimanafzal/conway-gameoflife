"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketConnection = void 0;
var react_1 = __importDefault(require("react"));
var react_redux_1 = require("react-redux");
var WebSocketConnectionComponent = function (_a) {
    var isConnected = _a.isConnected, children = _a.children;
    if (!isConnected)
        return react_1.default.createElement("span", null, "Connecting...");
    return react_1.default.createElement(react_1.default.Fragment, null, children);
};
/**
 * Renders child elements when the App is connected to the WebSocket.
 */
exports.WebSocketConnection = react_redux_1.connect(function (state) { return ({ isConnected: state.socket.isConnected }); })(WebSocketConnectionComponent);
