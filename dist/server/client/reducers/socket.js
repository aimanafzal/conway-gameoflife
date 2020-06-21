"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
var immer_1 = __importDefault(require("immer"));
var socket_1 = require("../actions/socket");
var initialState = { isConnected: false };
exports.socket = immer_1.default(function (state, action) {
    switch (action.type) {
        case socket_1.WS_OPEN:
            state.isConnected = true;
            return;
        case socket_1.WS_CLOSE:
            state.isConnected = false;
            return;
    }
}, initialState);
