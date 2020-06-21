"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var immer_1 = require("immer");
var App_1 = require("./components/App");
immer_1.enableMapSet();
react_dom_1.default.render(react_1.default.createElement(App_1.App, null), document.getElementById('app'));
