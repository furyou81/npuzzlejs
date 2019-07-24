"use strict";

var _Node = require("./Node");

var _Node2 = _interopRequireDefault(_Node);

var _Engine = require("./Engine");

var _Engine2 = _interopRequireDefault(_Engine);

var _Constants = require("./Constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mock84 = [[3, 13, 4, 5], [14, 8, 0, 6], [2, 15, 7, 9], [12, 10, 11, 1]];

var mockInitialState = [[0, 2, 3], [1, 4, 5], [8, 7, 6]];

var rootNode = new _Node2.default(mock84);
var engine = new _Engine2.default(rootNode, _Constants.Heuristic.MANHATTAN);
console.log("ROOT NODE");
rootNode.draw();
engine.execute();