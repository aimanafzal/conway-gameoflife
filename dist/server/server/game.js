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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var world_1 = require("../common/world");
var color_1 = require("../common/color");
/**
 * Represents an instance of Conway's Game of Life game state.
 */
var Game = /** @class */ (function () {
    /**
     * Creates an instance of the Game of Life
     * @param world A collection of living Cells
     */
    function Game(world) {
        this._world = world || [];
        this._lookup = world_1.createLookup(this._world);
    }
    Object.defineProperty(Game.prototype, "lookup", {
        get: function () {
            return this._lookup;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "world", {
        get: function () {
            return this._world;
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.setCell = function (cell, isAlive) {
        if ((typeof this._lookup(cell) !== 'undefined') === isAlive) {
            return this; // no effect on state
        }
        return new Game(world_1.setCell(this._world, cell, isAlive));
    };
    Game.prototype.drawCells = function (color, cells) {
        if (cells.length === 0)
            return this;
        return new Game(world_1.setCells(this._world, cells.map(function (_a) {
            var x = _a.x, y = _a.y;
            return ({ x: x, y: y, color: color });
        })));
    };
    Game.prototype.range = function () {
        return world_1.range(this._world);
    };
    Game.prototype.lookupNeighbors = function (point) {
        return world_1.lookupNeighbors(point, this._lookup);
    };
    /**
     * Gets the next instance of the Game of Life state
     */
    Game.prototype.tick = function () {
        var _this = this;
        return new Game(__spread(world_1.cells(this._world)).map(function (point) { return ({
            point: point,
            neighbors: __spread(_this.lookupNeighbors(point)),
            cell: _this._lookup(point)
        }); })
            .filter(function (_a) {
            var neighbors = _a.neighbors, cell = _a.cell;
            if (typeof cell !== 'undefined') {
                if (underpopulated(neighbors.length))
                    return false;
                if (nextGeneration(neighbors.length))
                    return true;
                if (overpopulated(neighbors.length))
                    return false;
            }
            else {
                if (reproduce(neighbors.length))
                    return true;
            }
        })
            .map(function (_a) {
            var cell = _a.cell, point = _a.point, neighbors = _a.neighbors;
            return ({
                x: point.x,
                y: point.y,
                color: reproduce(neighbors.length) || typeof cell === 'undefined'
                    ? color_1.mix(neighbors.map(function (z) { return z.color; }))
                    : cell.color
            });
        })
            // world bounds
            .filter(function (_a) {
            var x = _a.x, y = _a.y;
            return x >= 0 && y >= 0 && x <= world_1.MAX_X && y <= world_1.MAX_Y;
        }));
    };
    Game.prototype.toString = function () {
        return world_1.stringify(this._world, this._lookup);
    };
    return Game;
}());
exports.Game = Game;
var underpopulated = function (neighbors) { return neighbors < 2; };
var nextGeneration = function (neighbors) { return neighbors === 2 || neighbors === 3; };
var overpopulated = function (neighbors) { return neighbors > 2; };
var reproduce = function (neighbors) { return neighbors === 3; };
