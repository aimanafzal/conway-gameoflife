"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Welcome = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var react_1 = __importDefault(require("react"));
var styles_1 = require("../styles");
var react_redux_1 = require("react-redux");
var messages_1 = require("../actions/messages");
var styles_2 = require("../styles");
var touch_1 = require("../util/touch");
var WelcomeComponent = function (_a) {
    var color = _a.color, colorName = _a.colorName, newColor = _a.newColor, playerCount = _a.playerCount;
    return core_1.jsx("article", { css: styles_2.welcomeStyle },
        core_1.jsx("p", null,
            " ",
            core_1.jsx("a", { onClick: newColor, css: [{ color: color }, styles_1.colorNameCss] }, colorName),
            ". ",
            touch_1.isTouchDevice ? 'Touch on color' : 'Click on color'),
        core_1.jsx("p", null, typeof playerCount !== 'undefined' && playerCount > 1 ? (core_1.jsx(react_1.default.Fragment, null,
            "There ",
            playerCount - 1 === 1 ? 'is' : 'are',
            " ",
            core_1.jsx("strong", null, playerCount - 1),
            " ",
            playerCount - 1 === 1 ? 'other' : 'others',
            " player here ...")) : null));
};
exports.Welcome = react_redux_1.connect(function (state) { return ({ color: state.game.color, colorName: state.game.colorName, playerCount: state.game.playerCount }); }, function (dispatch) { return ({ newColor: function () { return dispatch(messages_1.newColor()); } }); })(WelcomeComponent);
