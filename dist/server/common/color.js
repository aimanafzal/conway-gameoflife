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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mix = exports.hexToRgb = exports.rgbToHex = exports.colorName = exports.colorRanking = exports.randomColor = void 0;
var immer_1 = __importDefault(require("immer"));
var color_1 = __importDefault(require("color"));
var color_namer_1 = __importDefault(require("color-namer"));
/** Generates a random color */
exports.randomColor = function () { return color_1.default.hsl(rand(0, 360), 100, rand(40, 65)).hex(); };
var reduceRanking = immer_1.default(function (map, cell) {
    var name = exports.colorName(cell.color);
    var rank = map.get(name);
    if (rank) {
        rank.count += 1;
    }
    else {
        rank = { color: cell.color, name: name, count: 1 };
    }
    map.set(name, rank);
});
/**
 * Gets color ranking from a World
 * @param world The World
 */
exports.colorRanking = function (world) {
    return __spread(world.reduce(reduceRanking, new Map()).values()).sort(function (x, y) { return y.count - x.count; });
};
/**
 * Gives a HTML color a name
 * @param color
 */
exports.colorName = function (color) { return color_namer_1.default(color, { pick: ['html'] }).html[0].name; };
/**
 * Converts RGB values to HTML color
 * @param r Red
 * @param g Green
 * @param b Blue
 */
exports.rgbToHex = function (r, g, b) { return color_1.default.rgb(r, g, b).hex(); };
/**
 * Converts HTML color string to RGB values
 * @param hex
 */
exports.hexToRgb = function (hex) {
    var obj = color_1.default(hex);
    return [obj.red(), obj.green(), obj.blue()];
};
/**
 * Generates a random value
 * @param min
 * @param max
 */
var rand = function (min, max) { return Math.random() * (max - min) + min; };
/**
 * Caches values of the mix fn
 */
var mixCache = new WeakMap();
/**
 * Combines colors
 * @param colors colors to mix
 */
exports.mix = function (colors) {
    if (mixCache.has(colors))
        return mixCache.get(colors);
    var result = colors.map(function (c) { return color_1.default(c); }).reduce(function (x, y) { return x.mix(y); }).hex();
    mixCache.set(colors, result);
    return result;
};
