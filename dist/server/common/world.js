"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCells = exports.setCell = exports.lookupNeighbors = exports.toArray = exports.stringify = exports.range = exports.cells = exports.encode = exports.createLookup = exports.MAX_Y = exports.MAX_X = void 0;
var immer_1 = __importDefault(require("immer"));
exports.MAX_X = 32;
exports.MAX_Y = 32;
/**
 * Creates a lookup of living Cells by location
 * @param world
 */
function createLookup(world) {
    var set = new Map(world.map(function (c) { return [exports.encode(c), c]; }));
    return function (p) { return set.get(exports.encode(p)); };
}
exports.createLookup = createLookup;
/**
 * Returns the String representation of a Point.
 */
exports.encode = function (cell) { return cell.x + "," + cell.y; };
/**
 * Iterates through all Cells in the World
 */
function cells(world) {
    var _a, min, max, x, y;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = range(world), min = _a.min, max = _a.max;
                x = min.x;
                _b.label = 1;
            case 1:
                if (!(x <= max.x)) return [3 /*break*/, 6];
                y = min.y;
                _b.label = 2;
            case 2:
                if (!(y <= max.y)) return [3 /*break*/, 5];
                return [4 /*yield*/, { x: x, y: y }];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                ++y;
                return [3 /*break*/, 2];
            case 5:
                ++x;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}
exports.cells = cells;
var reduceRange = immer_1.default(function (range, point) {
    if (point.x < range.min.x)
        range.min.x = point.x;
    if (point.y < range.min.y)
        range.min.y = point.y;
    if (point.x > range.max.x)
        range.max.x = point.x;
    if (point.y > range.max.y)
        range.max.y = point.y;
});
var expandRange = immer_1.default(function (range) {
    range.min.x--;
    range.min.y--;
    range.max.x++;
    range.max.y++;
});
/**
 * Reduces the World state into the minimum and maximum known cooridnates of living Cells.
 */
function range(world) {
    var range = world.reduce(reduceRange, { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } });
    return expandRange(range);
}
exports.range = range;
/**
 * Returns a string representation of a World grid.
 */
function stringify(world, lookup) {
    if (lookup === void 0) { lookup = createLookup(world); }
    var _a = range(world), min = _a.min, max = _a.max;
    var stringBuilder = [];
    for (var x = min.x; x <= max.x; ++x) {
        for (var y = min.y; y <= max.y; ++y) {
            stringBuilder.push((typeof lookup({ x: x, y: y }) !== 'undefined') ? ' ⬛ ' : ' ⬜ ');
        }
        stringBuilder.push('\n');
    }
    return stringBuilder.join('');
}
exports.stringify = stringify;
/**
 * Returns a Boolean array representation of the World grid.
 */
function toArray(world, lookup) {
    if (lookup === void 0) { lookup = createLookup(world); }
    var _a = range(world), min = _a.min, max = _a.max;
    var grid = [];
    for (var y = min.y; y <= max.y; ++y) {
        var row = [];
        for (var x = min.x; x <= max.x; ++x) {
            row.push(typeof lookup({ x: x, y: y }) !== 'undefined');
        }
        grid.push(row);
    }
    return grid;
}
exports.toArray = toArray;
/**
 * Looks up a list of adjacent Cells
 */
function lookupNeighbors(cell, lookup) {
    var neighbors = [
        { x: cell.x - 1, y: cell.y - 1 },
        { x: cell.x, y: cell.y - 1 },
        { x: cell.x + 1, y: cell.y - 1 },
        { x: cell.x - 1, y: cell.y },
        { x: cell.x + 1, y: cell.y },
        { x: cell.x - 1, y: cell.y + 1 },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x + 1, y: cell.y + 1 } // bottom right
    ];
    return neighbors.map(lookup).filter(function (c) { return typeof c !== 'undefined'; }).map(function (c) { return c; });
}
exports.lookupNeighbors = lookupNeighbors;
/**
 * Adds or removes a Cell from the World
 * @param world
 * @param cell
 * @param alive
 */
exports.setCell = function (world, cell, alive) {
    return alive
        ? __spread(world, [cell]) : __spread(world).filter(function (_a) {
        var x = _a.x, y = _a.y;
        return x !== cell.x || y !== cell.y;
    });
};
/**
 * Adds Cells to the World
 * @param world
 * @param cells
 */
exports.setCells = function (world, cells) {
    var cellsLookup = createLookup(cells);
    return __spread(world.filter(function (cell) { return typeof cellsLookup(cell) === 'undefined'; }), cells);
};
