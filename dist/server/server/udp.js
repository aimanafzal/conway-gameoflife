"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdpServer = void 0;
var dgram = __importStar(require("dgram"));
var clientKey = function (client) { return client.address + ":" + client.port; };
var clientInfo = function (str) {
    var _a = __read(str.split(':'), 2), address = _a[0], port = _a[1];
    return { address: address, port: parseInt(port) };
};
var UdpServer = /** @class */ (function () {
    function UdpServer() {
        var _this = this;
        this._clients = new Set();
        this._socket = dgram.createSocket('udp4', function (msg, rinfo) { return _this.receive(msg, rinfo); });
        this._socket.on('error', function (err) { return console.error(err); });
    }
    UdpServer.prototype.broadcast = function (data) {
        var _this = this;
        __spread(this._clients).map(clientInfo).forEach(function (c) { return _this._socket.send(data, c.port, c.address, function (err) {
            if (err) {
                _this._clients.delete(clientKey(c));
                console.error(err);
            }
        }); });
    };
    UdpServer.prototype.receive = function (msg, rinfo) {
        var status = msg.readUInt8(0);
        var key = clientKey(rinfo);
        if (status) { // available
            if (!this._clients.has(key)) {
                this._clients.add(key);
            }
        }
        else { // unavailable
            this._clients.delete(key);
        }
    };
    UdpServer.prototype.listen = function (port) {
        var _this = this;
        var bind = new Promise(function (resolve) { return _this._socket.on('close', function () { return resolve(); }); });
        this._socket.bind(port, '0.0.0.0', function () { return console.log('UDP socket bound on ' + port); });
        return bind;
    };
    return UdpServer;
}());
exports.UdpServer = UdpServer;
