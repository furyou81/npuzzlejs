"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require("./Constants");

var _Node = require("./Node");

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinyQueue = require("tinyqueue");


function sortNumber(a, b) {
    return a - b;
}

function sortNode(a, b) {
    return a.scoreF() - b.scoreF();
}

var Engine = function () {
    function Engine(rootNode, heuristic) {
        _classCallCheck(this, Engine);

        this.rootNode = rootNode;
        this.heuristic = heuristic;
        this.puzzleSize = rootNode.state.length;
        this.findGoal();
        this.isFound = false;
        this.rootNode = this.applyHeuristic(rootNode, heuristic);
    }

    _createClass(Engine, [{
        key: "findGoal",
        value: function findGoal() {
            var goal = JSON.parse(JSON.stringify(this.rootNode.state));
            var numbers = [];
            for (var j = 0; j < goal.length; j++) {
                for (var i = 0; i < goal[0].length; i++) {
                    numbers.push(goal[j][i]);
                }
            }
            numbers = numbers.sort(sortNumber);
            numbers = numbers.slice(1, numbers.length);
            var xmax = goal[0].length - 1;
            var ymax = goal.length - 1;

            var numberIndex = 0;
            var x = 0;
            for (var y = 0; y <= ymax / 2; y++) {
                for (var xx = x; xx <= xmax - x; xx++) {
                    goal[y][xx] = numberIndex < numbers.length ? numbers[numberIndex] : 0;
                    numberIndex = numberIndex + 1;
                }
                if (y + 1 <= ymax - y) {
                    for (var yy = y + 1; yy <= ymax - y; yy++) {
                        goal[yy][xmax - x] = numberIndex < numbers.length ? numbers[numberIndex] : 0;
                        numberIndex = numberIndex + 1;
                    }
                }
                for (var _xx = xmax - x - 1; _xx >= x; _xx--) {
                    goal[ymax - y][_xx] = numberIndex < numbers.length ? numbers[numberIndex] : 0;
                    numberIndex = numberIndex + 1;
                }
                if (y + 1 <= ymax - y) {
                    for (var _yy = ymax - y - 1; _yy >= y + 1; _yy--) {
                        goal[_yy][x] = numberIndex < numbers.length ? numbers[numberIndex] : 0;
                        numberIndex = numberIndex + 1;
                    }
                }
                x = x + 1;
            }
            this.goalState = new _Node2.default(goal);
            console.log("GOAL");
            this.goalState.draw();
        }
    }, {
        key: "applyHeuristic",
        value: function applyHeuristic(node, heuristic) {
            switch (heuristic) {
                case _Constants.Heuristic.MISPLACEDTILES:
                    node.scoreH = 0;
                case _Constants.Heuristic.EUCLIDEAN:
                    print("euclidean");
                case _Constants.Heuristic.MANHATTAN:
                    node.scoreH = this.manhattanHeuristic(node);
            }
            return node;
        }
    }, {
        key: "manhattanHeuristic",
        value: function manhattanHeuristic(node) {
            var manhattanDistances = 0;
            for (var y = 0; y <= node.state.length - 1; y++) {
                for (var x = 0; x <= node.state[0].length - 1; x++) {
                    if (node.state[y][x] !== 0 && node.state[y][x] !== this.goalState.state[y][x]) {

                        var currentIndex = node.flatState.indexOf(node.state[y][x]);
                        var goalIndex = this.goalState.flatState.indexOf(node.state[y][x]);
                        var h = Math.floor(Math.abs(Math.floor(currentIndex / this.puzzleSize) - Math.floor(goalIndex / this.puzzleSize)));
                        var w = Math.floor(Math.abs(Math.floor(currentIndex % this.puzzleSize) - Math.floor(goalIndex % this.puzzleSize)));
                        manhattanDistances = manhattanDistances + h + w;
                    }
                }
            }
            return manhattanDistances;
        }
    }, {
        key: "execute",
        value: function execute() {
            var _this = this;

            this.openList = new TinyQueue([this.rootNode], sortNode);
            this.closedList = {};

            while (this.openList.length > 0 && !this.isFound) {
                // if (Object.keys(this.closedList).length % 1000 === 0) {
                //     console.log("CLOSED: ", Object.keys(this.closedList).length)
                // }
                var current = this.openList.pop();

                var children = this.getChildren(current);
                children.forEach(function (child) {
                    // if successor is the goal, stop search
                    // console.log(child.hash, this.goalState.hash)
                    if (child.hash === _this.goalState.hash) {
                        console.log("END");

                        var n = child;
                        var nb = 0;
                        while (n.parent != null) {
                            n.draw();
                            n = n.parent;
                            nb = nb + 1;
                        }
                        console.log("nb: ", nb, "open: ", _this.openList.length, "closed: ", Object.keys(_this.closedList).length);
                        _this.isFound = true;
                        return;
                    }

                    if (_this.closedList[child.hash] != null) {
                        return;
                    } else {
                        var c = _this.applyHeuristic(child, _this.heuristic);
                        c.scoreG = current.scoreG + 1;

                        // if (openList.queue.contains(where: { $0 == c && $0.scoreF < c.scoreF })) {
                        //     continue ;
                        // }

                        if (_this.closedList[c.hash] != null) {
                            if (c.scoreF() > _this.closedList[c.hash].scoreF()) {
                                ;
                            } else {
                                _this.openList.push(c);
                            }
                        } else {
                            _this.openList.push(c);
                        }

                        // openList.push(c);
                    }
                });

                this.closedList[current.hash] = current;
            }
        }
    }, {
        key: "getChildren",
        value: function getChildren(current) {
            var children = [];

            var states = current.findPossibleState();
            states.forEach(function (child) {
                var newNode = new _Node2.default(child, current);
                children.push(newNode);
            });
            return children;
        }
    }]);

    return Engine;
}();

exports.default = Engine;