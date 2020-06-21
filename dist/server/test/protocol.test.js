"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protocol_1 = require("../common/protocol");
var models_1 = require("../models");
var color = '#FFEEDD';
// glider
var world = [
    { x: 1, y: 0, color: color },
    { x: 2, y: 1, color: color },
    { x: 0, y: 2, color: color },
    { x: 1, y: 2, color: color },
    { x: 2, y: 2, color: color }
];
var serializeDeserialize = function (message) {
    var data = protocol_1.serializeMessage(message);
    expect(data.length).toBeGreaterThan(0);
    var result = protocol_1.deserializeMessage(data);
    expect(result).toEqual(message);
};
describe('protocol', function () {
    test('Update', function () { return serializeDeserialize({
        type: models_1.MessageType.Update,
        world: world
    }); });
    test('SetCell', function () { return serializeDeserialize({
        type: models_1.MessageType.SetCell,
        alive: true,
        cell: world[0]
    }); });
    test('Color', function () { return serializeDeserialize({
        type: models_1.MessageType.Color,
        color: color
    }); });
    test('NewColor', function () { return serializeDeserialize({
        type: models_1.MessageType.NewColor
    }); });
    test('PlayerCount', function () { return serializeDeserialize({
        type: models_1.MessageType.PlayerCount,
        count: 5
    }); });
    test('DrawCells', function () { return serializeDeserialize({
        type: models_1.MessageType.DrawCells,
        color: color,
        cells: world.map(function (_a) {
            var x = _a.x, y = _a.y;
            return ({ x: x, y: y });
        })
    }); });
    test('writeReadColor', function () {
        var buffer = Buffer.alloc(12);
        protocol_1.writeColor(buffer, 0, color);
        var result = protocol_1.readColor(buffer, 0);
        expect(result).toEqual(color);
    });
});
