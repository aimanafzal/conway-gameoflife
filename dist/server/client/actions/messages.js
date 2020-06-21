"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newColor = exports.drawCells = exports.setCell = void 0;
var models_1 = require("../../models");
var socket_1 = require("./socket");
exports.setCell = function (cell, alive) { return sendMessage({
    type: models_1.MessageType.SetCell,
    cell: cell,
    alive: alive
}); };
exports.drawCells = function (color, cells) { return sendMessage({
    type: models_1.MessageType.DrawCells,
    color: color,
    cells: cells
}); };
exports.newColor = function () { return sendMessage({ type: models_1.MessageType.NewColor }); };
var sendMessage = function (message) { return socket_1.send(message); };
