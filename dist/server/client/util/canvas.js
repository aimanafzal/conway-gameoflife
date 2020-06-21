"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translatePosition = exports.drawCell = void 0;
exports.drawCell = function (ctx, cell, width, height) {
    ctx.fillStyle = cell.color;
    ctx.shadowBlur = 2;
    ctx.shadowColor = cell.color;
    ctx.fillRect(cell.x * width, cell.y * height, width, height);
};
exports.translatePosition = function (canvas, clientX, clientY, width, height) {
    var rect = canvas.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;
    return {
        x: Math.floor(x / width),
        y: Math.floor(y / height)
    };
};
