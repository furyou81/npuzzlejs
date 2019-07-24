import Node from "./Node";
import Engine from "./Engine";
import {Heuristic} from "./Constants";

var mock84 = [
    [3, 13, 4, 5],
    [14, 8, 0, 6],
    [2, 15, 7, 9],
    [12, 10, 11, 1]
]

var mockInitialState = [
    [0, 2, 3],
    [1, 4, 5],
    [8, 7, 6]
]

var rootNode = new Node(mock84);
var engine = new Engine(rootNode, Heuristic.MANHATTAN);
console.log("ROOT NODE")
rootNode.draw();
engine.execute();