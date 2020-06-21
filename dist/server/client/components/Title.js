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
exports.Title = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_redux_1 = require("react-redux");
var react_1 = require("react");
var styles_1 = require("../styles");
var TitleComponent = function (_a) {
    var text = _a.text, colors = _a.colors;
    if (!colors || colors.length === 0)
        return core_1.jsx("h1", { css: styles_1.titleStyle }, text);
    var charColors = react_1.useMemo(function () { return __spread(text).map(function (char, i) { return ({
        char: char,
        color: colors[i % colors.length].color
    }); }); }, [text, colors]);
    return core_1.jsx("h1", { css: styles_1.titleStyle }, charColors.map(function (_a, i) {
        var char = _a.char, color = _a.color;
        return core_1.jsx("span", { key: 'c' + i, css: [{ color: color, textShadow: "0 0 4px " + color }, styles_1.titleCharStyle] }, char);
    }));
};
exports.Title = react_redux_1.connect(function (state) { return ({ colors: state.game.colorRanking }); }, function (dispatch) { return ({}); })(TitleComponent);
