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
    [1, 2, 3],
    [0, 4, 5],
    [8, 7, 6]
]

let medium = [
    [15, 13, 5, 3],
    [14, 8, 1, 10],
    [2, 7, 0, 4],
    [6, 9, 12, 11]
]

var nilPos = Node.findNilPosition(mockInitialState)
var rootNode = new Node(mockInitialState, null, nilPos);
var engine = new Engine(rootNode, Heuristic.MANHATTAN);
console.log("ROOT NODE")
rootNode.draw();
engine.execute();