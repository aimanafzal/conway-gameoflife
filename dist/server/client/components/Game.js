"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var messages_1 = require("../actions/messages");
var styles_1 = require("../styles");
var world_1 = require("../../common/world");
var touch_1 = require("../util/touch");
var canvas_1 = require("../util/canvas");
var protocol_1 = require("../../common/protocol");
var GameComponent = function (_a) {
    var world = _a.world, range = _a.range, sendDrawCells = _a.sendDrawCells, color = _a.color, playerCount = _a.playerCount;
    if (!color || typeof world === 'undefined' || typeof range === 'undefined') {
        return core_1.jsx("span", null, "Awaiting the World state...");
    }
    var canvasRef = react_1.useRef(null);
    var _b = __read(react_1.useState({
        isDrawing: false,
        points: new Array()
    }), 2), drawingState = _b[0], setDrawingState = _b[1];
    var drawingStateRef = react_1.useRef(drawingState);
    var dimensionsRef = react_1.useRef({ cellWidth: 14, cellHeight: 14 });
    react_1.useEffect(function () {
        var e_1, _a;
        document.title = typeof playerCount !== 'undefined' && playerCount > 1 ? "MultiLife! (" + (playerCount - 1) + ")" : 'MultiLife!';
        var canvas = canvasRef.current;
        if (canvas) {
            var parent_1 = canvas.parentNode;
            if (parent_1) {
                var styles = getComputedStyle(parent_1);
                var width = parseFloat(styles.getPropertyValue('width'));
                var height = parseFloat(styles.getPropertyValue('height'));
                var size = Math.min(width, height);
                canvas.width = size;
                canvas.height = size;
            }
            dimensionsRef.current = {
                cellWidth: canvas.width / world_1.MAX_X,
                cellHeight: canvas.height / world_1.MAX_Y
            };
            var ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, dimensionsRef.current.cellWidth, canvas.height * dimensionsRef.current.cellHeight);
                var currentWorld = world_1.setCells(world, drawingStateRef.current.points.map(function (_a) {
                    var x = _a.x, y = _a.y;
                    return ({ x: x, y: y, color: color });
                }));
                try {
                    for (var currentWorld_1 = __values(currentWorld), currentWorld_1_1 = currentWorld_1.next(); !currentWorld_1_1.done; currentWorld_1_1 = currentWorld_1.next()) {
                        var cell = currentWorld_1_1.value;
                        canvas_1.drawCell(ctx, cell, dimensionsRef.current.cellWidth, dimensionsRef.current.cellHeight);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (currentWorld_1_1 && !currentWorld_1_1.done && (_a = currentWorld_1.return)) _a.call(currentWorld_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                var favicon = document.getElementById('favicon');
                if (favicon)
                    favicon.href = canvas.toDataURL();
            }
        }
    }, [canvasRef, range, world, playerCount, drawingStateRef]);
    var onBeginDrawing = function (canvas, points) {
        var e_2, _a;
        if (!color)
            return;
        var ctx = canvas.getContext('2d');
        try {
            for (var points_1 = __values(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                var point = points_1_1.value;
                var cell = __assign(__assign({}, canvas_1.translatePosition(canvas, point.x, point.y, dimensionsRef.current.cellWidth, dimensionsRef.current.cellHeight)), { color: color });
                if (ctx)
                    canvas_1.drawCell(ctx, cell, dimensionsRef.current.cellWidth, dimensionsRef.current.cellHeight);
                var nextState = {
                    isDrawing: true,
                    points: [cell]
                };
                drawingStateRef.current = nextState;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (points_1_1 && !points_1_1.done && (_a = points_1.return)) _a.call(points_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        setDrawingState(drawingStateRef.current);
    };
    var onDrawing = function (canvas, points) {
        var e_3, _a;
        if (!color)
            return;
        if (!drawingStateRef.current.isDrawing)
            return;
        if (drawingStateRef.current.points.length >= protocol_1.MAX_DRAW_CELLS_LENGTH)
            return;
        var _loop_1 = function (point) {
            var _a = canvas_1.translatePosition(canvas, point.x, point.y, dimensionsRef.current.cellWidth, dimensionsRef.current.cellHeight), x = _a.x, y = _a.y;
            var exists = drawingStateRef.current.points.some(function (p) { return x === p.x && y === p.y; });
            if (!exists) {
                var cell = { x: x, y: y, color: color };
                var ctx = canvas.getContext('2d');
                if (ctx) {
                    canvas_1.drawCell(ctx, cell, dimensionsRef.current.cellWidth, dimensionsRef.current.cellHeight);
                }
                var nextState = {
                    isDrawing: true,
                    points: __spread(drawingStateRef.current.points, [{ x: x, y: y }]),
                };
                drawingStateRef.current = nextState;
            }
        };
        try {
            for (var points_2 = __values(points), points_2_1 = points_2.next(); !points_2_1.done; points_2_1 = points_2.next()) {
                var point = points_2_1.value;
                _loop_1(point);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (points_2_1 && !points_2_1.done && (_a = points_2.return)) _a.call(points_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        setDrawingState(drawingStateRef.current);
    };
    var onEndDrawing = function () {
        if (!color)
            return;
        var currentDrawingState = drawingStateRef.current;
        if (currentDrawingState.points.length > 0) {
            sendDrawCells(color, currentDrawingState.points);
        }
        var nextState = {
            isDrawing: false,
            points: []
        };
        drawingStateRef.current = nextState;
        setDrawingState(nextState);
    };
    return core_1.jsx("div", { css: styles_1.canvasContainerStyle },
        core_1.jsx("canvas", { css: styles_1.canvasStyle, ref: canvasRef, onMouseDown: function (event) { return onBeginDrawing(event.target, [{ x: event.clientX, y: event.clientY }]); }, onTouchStart: function (event) {
                event.preventDefault();
                onBeginDrawing(event.target, __spread(touch_1.touches(event.changedTouches)));
            }, onMouseMove: function (event) {
                if (event.buttons !== 1)
                    return onEndDrawing();
                onDrawing(event.target, [{ x: event.clientX, y: event.clientY }]);
            }, onTouchMove: function (event) {
                event.preventDefault();
                onDrawing(event.target, __spread(touch_1.touches(event.changedTouches)));
            }, onMouseUp: function () { return onEndDrawing(); }, onTouchEnd: function (event) {
                event.preventDefault();
                onEndDrawing();
            } }));
};
exports.Game = react_redux_1.connect(function (_a) {
    var game = _a.game;
    return ({ world: game.world, range: game.range, color: game.color, playerCount: game.playerCount });
}, function (dispatch) { return ({
    sendSetCell: function (cell, alive) { return dispatch(messages_1.setCell(cell, alive)); },
    sendDrawCells: function (color, cells) { return dispatch(messages_1.drawCells(color, cells)); }
}); })(GameComponent);
