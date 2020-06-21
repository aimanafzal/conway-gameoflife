"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = exports.initialState = void 0;
var immer_1 = __importDefault(require("immer"));
var models_1 = require("../../models");
var world_1 = require("../../common/world");
var color_1 = require("../../common/color");
var socket_1 = require("../actions/socket");
exports.initialState = {};
exports.game = immer_1.default(function (state, action) {
    switch (action.type) {
        case socket_1.WS_SEND:
        case socket_1.WS_RECEIVE:
            handleMessage(state, action.message);
            break;
    }
}, exports.initialState);
var handleMessage = function (state, message) {
    if (models_1.isUpdateMessage(message)) {
        state.world = message.world;
        if (state.drawnCells) {
            state.world = world_1.setCells(state.world || [], state.drawnCells);
        }
        delete state.drawnCells;
        updateState(state);
    }
    else if (models_1.isSetCellMessage(message)) {
        var cell = message.cell, alive = message.alive;
        state.world = world_1.setCell(state.world || [], cell, alive);
        updateState(state);
    }
    else if (models_1.isColorMessage(message)) {
        state.color = message.color;
        state.colorName = color_1.colorName(message.color);
    }
    else if (models_1.isPlayerCountMessage(message)) {
        state.playerCount = message.count;
    }
    else if (models_1.isDrawCellsMessage(message)) {
        state.drawnCells = message.cells.map(function (_a) {
            var x = _a.x, y = _a.y;
            return ({ x: x, y: y, color: message.color });
        });
        state.world = world_1.setCells(state.world || [], state.drawnCells);
        updateState(state);
    }
};
var updateState = function (state) {
    if (state.world) {
        state.colorRanking = color_1.colorRanking(state.world);
        state.range = world_1.range(state.world);
    }
};
