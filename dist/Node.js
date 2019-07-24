'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Direction = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

var Node = function () {
    function Node(state) {
        var _this = this;

        var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, Node);

        this.parent = parent;
        this.scoreG = parent != null ? parent.scoreG + 1 : 0;
        this.state = state;
        var hash = "";
        state.forEach(function (row) {
            row.forEach(function (column) {
                hash = hash + String(column);
            });
        });
        this.hash = hash;
        this.flatState = [];
        state.forEach(function (row) {
            row.forEach(function (column) {
                _this.flatState.push(column);
            });
        });
    }

    _createClass(Node, [{
        key: 'scoreF',
        value: function scoreF() {
            return this.scoreG + this.scoreH;
        }
    }, {
        key: 'findPossibleState',
        value: function findPossibleState() {
            var _this2 = this;

            var possibleStates = [];
            var nilPosition = this.findNilPosition();
            var directions = this.findDirections(nilPosition);

            directions.forEach(function (direction) {
                var newState = _this2.swapState(nilPosition, direction);
                possibleStates.push(newState);
            });
            return possibleStates;
        }
    }, {
        key: 'swapState',
        value: function swapState(position, direction) {
            var newState = JSON.parse(JSON.stringify(this.state));
            // console.log("ICI", position, direction, newState)
            switch (direction) {
                case Direction.DOWN:
                    // console.log("ICICICI")
                    newState[position.y][position.x] = newState[position.y + 1][position.x];
                    newState[position.y + 1][position.x] = 0;
                    break;
                case Direction.LEFT:
                    // console.log("ISDSDSDDSDS")
                    newState[position.y][position.x] = newState[position.y][position.x - 1];
                    newState[position.y][position.x - 1] = 0;
                    break;
                case Direction.RIGHT:
                    newState[position.y][position.x] = newState[position.y][position.x + 1];
                    newState[position.y][position.x + 1] = 0;
                    break;
                case Direction.UP:
                    // console.log("IPPP????", position, direction, Direction.UP)
                    newState[position.y][position.x] = newState[position.y - 1][position.x];
                    newState[position.y - 1][position.x] = 0;
                    break;
            }
            return newState;
        }
    }, {
        key: 'findNilPosition',
        value: function findNilPosition() {
            for (var y = 0; y < this.state.length; y++) {
                for (var x = 0; x < this.state[0].length; x++) {
                    if (this.state[y][x] === 0) {
                        return { x: x, y: y };
                    }
                }
            }
        }
    }, {
        key: 'findDirections',
        value: function findDirections(nilPosition) {
            var directions = [];
            if (nilPosition.y > 0) {
                directions.push(Direction.UP);
            }
            if (nilPosition.y < this.state.length - 1) {
                directions.push(Direction.DOWN);
            }
            if (nilPosition.x > 0) {
                directions.push(Direction.LEFT);
            }
            if (nilPosition.x < this.state[0].length - 1) {
                directions.push(Direction.RIGHT);
            }
            return directions;
        }
    }, {
        key: 'isEqual',
        value: function isEqual(node) {
            return this.hash === node.hash;
        }
    }, {
        key: 'draw',
        value: function draw() {
            console.log(this.state);
        }
    }]);

    return Node;
}();

exports.default = Node;