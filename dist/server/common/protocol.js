"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeMessage = exports.writeColor = exports.readColor = exports.deserializeMessage = exports.MAX_UPDATE_LENGTH = exports.MAX_DRAW_CELLS_LENGTH = void 0;
var models_1 = require("../models");
var color_1 = require("./color");
var COLOR_LENGTH = 12;
var POINT_LENGTH = 2;
var CELL_LENGTH = POINT_LENGTH + COLOR_LENGTH;
var DRAW_CELLS_HEADER_LENGTH = 2 + COLOR_LENGTH;
var UPDATE_HEADER_LENGTH = 3;
exports.MAX_DRAW_CELLS_LENGTH = 255;
exports.MAX_UPDATE_LENGTH = 65535;
exports.deserializeMessage = function (data) {
    var messageType = data.readUInt8(0);
    switch (messageType) {
        case models_1.MessageType.Color: return readColorMessage(data);
        case models_1.MessageType.NewColor: return newColorMessage();
        case models_1.MessageType.PlayerCount: return readPlayerCount(data);
        case models_1.MessageType.SetCell: return readSetCell(data);
        case models_1.MessageType.Update: return readUpdate(data);
        case models_1.MessageType.DrawCells: return readDrawCells(data);
        default:
            throw new Error("Unknown MessageType " + messageType);
    }
};
var readColorMessage = function (data) { return ({
    type: models_1.MessageType.Color,
    color: exports.readColor(data, 1)
}); };
var newColorMessage = function () { return ({ type: models_1.MessageType.NewColor }); };
var readPlayerCount = function (data) { return ({
    type: models_1.MessageType.PlayerCount,
    count: data.readUInt32LE(1)
}); };
var readSetCell = function (data) { return ({
    type: models_1.MessageType.SetCell,
    alive: data.readUInt8(1) !== 0,
    cell: readCell(data, 2)
}); };
var readUpdate = function (data) {
    var length = data.readUInt16LE(1);
    var world = new Array(length);
    for (var i = 0; i < length; ++i) {
        world[i] = readCell(data, UPDATE_HEADER_LENGTH + (i * CELL_LENGTH));
    }
    return { type: models_1.MessageType.Update, world: world };
};
var readDrawCells = function (data) {
    var length = data.readUInt8(1);
    var cells = new Array(length);
    var color = exports.readColor(data, 2);
    for (var i = 0; i < length; ++i) {
        cells[i] = readPoint(data, DRAW_CELLS_HEADER_LENGTH + (POINT_LENGTH * i));
    }
    return {
        type: models_1.MessageType.DrawCells,
        cells: cells,
        color: color
    };
};
exports.readColor = function (data, offset) { return color_1.rgbToHex(data.readUInt32LE(offset), data.readUInt32LE(offset + 4), data.readUInt32LE(offset + 8)); };
exports.writeColor = function (data, offset, color) {
    var _a = __read(color_1.hexToRgb(color), 3), r = _a[0], g = _a[1], b = _a[2];
    data.writeUInt32LE(r, offset);
    data.writeUInt32LE(g, offset + 4);
    data.writeUInt32LE(b, offset + 8);
};
var readCell = function (data, offset) { return ({
    x: data.readUInt8(offset),
    y: data.readUInt8(offset + 1),
    color: exports.readColor(data, offset + 2)
}); };
var readPoint = function (data, offset) { return ({
    x: data.readUInt8(offset),
    y: data.readUInt8(offset + 1)
}); };
var writeCell = function (data, offset, cell) {
    writePoint(data, offset, cell);
    exports.writeColor(data, offset + POINT_LENGTH, cell.color);
};
var writePoint = function (data, offset, point) {
    data.writeUInt8(point.x, offset);
    data.writeUInt8(point.y, offset + 1);
};
var writeUpdate = function (message) {
    if (message.world.length > exports.MAX_UPDATE_LENGTH) {
        throw new RangeError("Max length of update is " + exports.MAX_UPDATE_LENGTH + ", received " + message.world.length);
    }
    var data = Buffer.alloc(UPDATE_HEADER_LENGTH + (message.world.length * CELL_LENGTH));
    data.writeUInt8(models_1.MessageType.Update, 0);
    data.writeUInt16LE(message.world.length, 1);
    for (var i = 0; i < message.world.length; ++i) {
        writeCell(data, UPDATE_HEADER_LENGTH + (i * CELL_LENGTH), message.world[i]);
    }
    return data;
};
var writeSetCell = function (message) {
    var data = Buffer.alloc(2 + CELL_LENGTH);
    data.writeUInt8(models_1.MessageType.SetCell, 0);
    data.writeUInt8(message.alive ? 1 : 0, 1);
    writeCell(data, 2, message.cell);
    return data;
};
var writeColorMessage = function (message) {
    var data = Buffer.alloc(1 + COLOR_LENGTH);
    data.writeUInt8(models_1.MessageType.Color, 0);
    exports.writeColor(data, 1, message.color);
    return data;
};
var writePlayerCount = function (message) {
    var data = Buffer.alloc(1 + 4);
    data.writeUInt8(models_1.MessageType.PlayerCount, 0);
    data.writeUInt32LE(message.count, 1);
    return data;
};
var writeDrawCells = function (message) {
    if (message.cells.length > exports.MAX_DRAW_CELLS_LENGTH) {
        throw new RangeError("Max length of DRAW_CELLS is " + exports.MAX_DRAW_CELLS_LENGTH + ", received " + message.cells.length);
    }
    var data = Buffer.alloc(DRAW_CELLS_HEADER_LENGTH + (message.cells.length * POINT_LENGTH));
    data.writeUInt8(models_1.MessageType.DrawCells, 0);
    data.writeUInt8(message.cells.length, 1);
    exports.writeColor(data, 2, message.color);
    for (var i = 0; i < message.cells.length; ++i) {
        writePoint(data, DRAW_CELLS_HEADER_LENGTH + (i * POINT_LENGTH), message.cells[i]);
    }
    return data;
};
var writeNewColor = function () {
    var data = Buffer.alloc(1);
    data.writeUInt8(models_1.MessageType.NewColor, 0);
    return data;
};
exports.serializeMessage = function (message) {
    if (models_1.isUpdateMessage(message))
        return writeUpdate(message);
    else if (models_1.isSetCellMessage(message))
        return writeSetCell(message);
    else if (models_1.isColorMessage(message))
        return writeColorMessage(message);
    else if (models_1.isPlayerCountMessage(message))
        return writePlayerCount(message);
    else if (models_1.isDrawCellsMessage(message))
        return writeDrawCells(message);
    else if (models_1.isNewColorMessage(message))
        return writeNewColor();
    throw new Error('Unhandled message type ' + message);
};
