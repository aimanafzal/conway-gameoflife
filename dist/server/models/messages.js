"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDrawCellsMessage = exports.isPlayerCountMessage = exports.isNewColorMessage = exports.isColorMessage = exports.isSetCellMessage = exports.isUpdateMessage = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Update"] = 1] = "Update";
    MessageType[MessageType["SetCell"] = 2] = "SetCell";
    MessageType[MessageType["Color"] = 3] = "Color";
    MessageType[MessageType["NewColor"] = 4] = "NewColor";
    MessageType[MessageType["PlayerCount"] = 5] = "PlayerCount";
    MessageType[MessageType["DrawCells"] = 6] = "DrawCells";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
exports.isUpdateMessage = function (message) {
    return message.type === MessageType.Update;
};
exports.isSetCellMessage = function (message) {
    return message.type === MessageType.SetCell;
};
exports.isColorMessage = function (message) {
    return message.type === MessageType.Color;
};
exports.isNewColorMessage = function (message) {
    return message.type === MessageType.NewColor;
};
exports.isPlayerCountMessage = function (message) {
    return message.type === MessageType.PlayerCount;
};
exports.isDrawCellsMessage = function (message) {
    return message.type === MessageType.DrawCells;
};
