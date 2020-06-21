"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
/** @jsx jsx */
var core_1 = require("@emotion/core");
var redux_1 = require("redux");
var reducers_1 = require("../reducers");
var react_redux_1 = require("react-redux");
var WebSocketConnection_1 = require("./WebSocketConnection");
var Game_1 = require("./Game");
var Colors_1 = require("./Colors");
var styles_1 = require("../styles");
var Welcome_1 = require("./Welcome");
var socket_1 = require("../actions/socket");
var Header_1 = require("./Header");
var store = redux_1.createStore(reducers_1.reducer);
socket_1.init(store);
exports.App = function () { return core_1.jsx("div", { css: styles_1.appStyle },
    core_1.jsx(core_1.Global, { styles: styles_1.globalStyle }),
    core_1.jsx(react_redux_1.Provider, { store: store },
        core_1.jsx(Header_1.Header, null),
        core_1.jsx(WebSocketConnection_1.WebSocketConnection, null,
            core_1.jsx(Welcome_1.Welcome, null),
            core_1.jsx("main", { css: styles_1.containerStyle },
                core_1.jsx("aside", { css: styles_1.sidebarStyle },
                    core_1.jsx(Colors_1.Colors, null)),
                core_1.jsx(Game_1.Game, null))))); };
