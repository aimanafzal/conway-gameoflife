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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.Server = void 0;
var http = __importStar(require("http"));
var ws = __importStar(require("ws"));
var game_events_1 = require("./game-events");
var color_1 = require("../common/color");
var models_1 = require("../models");
var protocol_1 = require("../common/protocol");
var udp_1 = require("./udp");
var HTTP_PORT = parseInt(process.env.HTTP_PORT || '80');
var UDP_PORT = parseInt(process.env.UDP_PORT || '31337');
var Server = /** @class */ (function () {
    function Server() {
        var _this = this;
        this._events = new game_events_1.GameEvents();
        this._httpServer = http.createServer();
        this._wsServer = new ws.Server({ server: this._httpServer });
        this._udpServer = new udp_1.UdpServer();
        var updateHandler = function (world) {
            if (_this._wsServer.clients.size === 0)
                return;
            var update = {
                type: models_1.MessageType.Update,
                world: world
            };
            var data = protocol_1.serializeMessage(update);
            _this._wsServer.clients.forEach(function (c) { return c.send(data); });
            _this._udpServer.broadcast(data);
        };
        var setCellHandler = function (cell, alive) {
            if (_this._wsServer.clients.size === 0)
                return;
            var setCell = { type: models_1.MessageType.SetCell, cell: cell, alive: alive };
            var data = protocol_1.serializeMessage(setCell);
            _this._wsServer.clients.forEach(function (c) { return c.send(data); });
            _this._udpServer.broadcast(data);
        };
        var drawCellsHandler = function (color, cells) {
            if (_this._wsServer.clients.size === 0)
                return;
            var message = { type: models_1.MessageType.DrawCells, color: color, cells: cells };
            var data = protocol_1.serializeMessage(message);
            _this._wsServer.clients.forEach(function (c) { return c.send(data); });
            _this._udpServer.broadcast(data);
        };
        this._events.on('setcell', function (cell, alive) { return setCellHandler(cell, alive); });
        this._events.on('drawcells', function (color, cells) { return drawCellsHandler(color, cells); });
        this._events.on('update', function (world) { return updateHandler(world); });
        this._wsServer.on('connection', function (connection) {
            console.debug('client connected');
            if (_this._events.isPaused)
                _this._events.start();
            _this.broadcastPlayerCount();
            var sendColor = function () {
                var color = color_1.randomColor();
                var colorMessage = {
                    type: models_1.MessageType.Color,
                    color: color
                };
                connection.send(protocol_1.serializeMessage(colorMessage));
                return color;
            };
            var connectionColor = sendColor();
            connection.on('message', function (data) {
                try {
                    var message = protocol_1.deserializeMessage(data);
                    if (models_1.isSetCellMessage(message)) {
                        var _a = message.cell, x = _a.x, y = _a.y;
                        _this._events.emit('setcell', { x: x, y: y, color: connectionColor }, message.alive);
                    }
                    else if (models_1.isDrawCellsMessage(message)) {
                        _this._events.emit('drawcells', connectionColor, message.cells);
                    }
                    else if (models_1.isNewColorMessage(message)) {
                        connectionColor = sendColor();
                    }
                }
                catch (err) {
                    console.error(err);
                }
            });
            connection.on('close', function () {
                if (_this._wsServer.clients.size === 0) {
                    _this._events.stop();
                }
                _this.broadcastPlayerCount();
            });
            _this._events.emit('refresh');
        });
    }
    Object.defineProperty(Server.prototype, "connectionCount", {
        get: function () {
            return __spread(this._wsServer.clients).length;
        },
        enumerable: false,
        configurable: true
    });
    Server.prototype.broadcastPlayerCount = function () {
        if (this._wsServer.clients.size === 0)
            return;
        var message = { type: models_1.MessageType.PlayerCount, count: this.connectionCount };
        var data = protocol_1.serializeMessage(message);
        console.log('connections: ' + message.count);
        this._wsServer.clients.forEach(function (client) { return client.send(data); });
        this._udpServer.broadcast(data);
    };
    Server.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var httpPromise, udpPromise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        httpPromise = new Promise(function (resolve) { return _this._httpServer.on('close', function () { return resolve(); }); });
                        this._httpServer.listen(HTTP_PORT, '0.0.0.0', function () { return console.log('HTTP listening on ' + HTTP_PORT); });
                        udpPromise = this._udpServer.listen(UDP_PORT);
                        return [4 /*yield*/, Promise.all([httpPromise, udpPromise])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Server;
}());
exports.Server = Server;
