"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.send = exports.WS_SEND = exports.WS_RECEIVE = exports.WS_CLOSE = exports.WS_OPEN = void 0;
var protocol_1 = require("../../common/protocol");
var blob_to_buffer_1 = __importDefault(require("blob-to-buffer"));
var url = function () {
    var scheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    var hostname = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
    var port = window.location.hostname === 'localhost' ? ':5000' : '';
    var resource = window.location.hostname === 'localhost' ? '/' : '/ws';
    return scheme + "//" + hostname + port + resource;
};
exports.WS_OPEN = 'WS_OPEN';
var wsOpen = function () { return ({ type: exports.WS_OPEN }); };
exports.WS_CLOSE = 'WS_CLOSE';
var wsClose = function () { return ({ type: exports.WS_CLOSE }); };
exports.WS_RECEIVE = 'WS_RECEIVE';
var wsReceive = function (message) { return ({
    type: exports.WS_RECEIVE,
    message: message
}); };
exports.WS_SEND = 'WS_SEND';
exports.send = function (message) {
    if (socket)
        socket.send(protocol_1.serializeMessage(message));
    return { type: exports.WS_SEND, message: message };
};
var socket = null;
exports.init = function (store) {
    socket = new WebSocket(url());
    window.addEventListener("focus", function () {
        if (!socket) {
            socket = new WebSocket(url());
            attachEvents(store);
        }
    });
    attachEvents(store);
};
var attachEvents = function (store) {
    if (!socket)
        return;
    socket.onopen = function () { return store.dispatch(wsOpen()); };
    socket.onclose = function () { return store.dispatch(wsClose()); };
    socket.onmessage = function (event) {
        var blob = event.data;
        blob_to_buffer_1.default(blob, function (err, buffer) {
            if (err) {
                console.error(err);
                return;
            }
            store.dispatch(wsReceive(protocol_1.deserializeMessage(buffer)));
        });
    };
};
