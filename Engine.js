var TinyQueue = require("tinyqueue");
import {Heuristic} from "./Constants";
import Node from "./Node";

function sortNumber(a, b) {
    return a - b;
}

function sortNode(a, b) {
    return a.scoreF() - b.scoreF();
}

class Engine {
    constructor(rootNode, heuristic) {
        this.rootNode = rootNode;
        this.heuristic = heuristic;
        this.puzzleSize = rootNode.state.length;
        this.findGoal();
        this.isFound = false;
        this.rootNode = this.applyHeuristic(rootNode, heuristic);
    }

    findGoal() {
        var goal= JSON.parse(JSON.stringify(this.rootNode.state));
        var numbers = [];
        for(let j = 0; j < goal.length; j++) {
            for (let i = 0; i < goal[0].length; i++) {
                numbers.push(goal[j][i]);
            }
        }
        numbers = numbers.sort(sortNumber)
        numbers = numbers.slice(1, numbers.length)
        var xmax = goal[0].length - 1
        var ymax = goal.length - 1
        
        let numberIndex = 0
        let x = 0
            for (let y = 0; y <= ymax / 2; y++) {
                    for (let xx = x; xx <= (xmax - x); xx++) {
                        goal[y][xx] = numberIndex < numbers.length ? numbers[numberIndex] : 0
                        numberIndex = numberIndex + 1
                    }
                if ((y + 1) <= (ymax - y)) {
                    for (let yy = (y + 1); yy <= (ymax - y); yy++) {
                        goal[yy][xmax - x] = numberIndex < numbers.length ? numbers[numberIndex] : 0
                        numberIndex = numberIndex + 1
                    }
                }
                    for (let xx = (xmax - x - 1); xx >= x; xx--) {
                        goal[ymax - y][xx] = numberIndex < numbers.length ? numbers[numberIndex] : 0
                        numberIndex = numberIndex + 1
                    }
                if ((y + 1) <= (ymax - y)) {
                    for (let yy = (ymax - y - 1); yy >= (y + 1 ); yy--) {
                        goal[yy][x] = numberIndex < numbers.length ? numbers[numberIndex] : 0
                        numberIndex = numberIndex + 1
                    }
                }
                x = x + 1
            }
        this.goalState = new Node(goal)
        console.log("GOAL")
        this.goalState.draw()
    }

    applyHeuristic(node, heuristic) {
        switch (heuristic) {
        case Heuristic.MISPLACEDTILES:
            node.scoreH = 0
        case Heuristic.EUCLIDEAN:
            print("euclidean")
        case Heuristic.MANHATTAN:
            node.scoreH = this.manhattanHeuristic(node)
        }
        return node;
    }

    manhattanHeuristic(node) {
        let manhattanDistances = 0;
        for (let y = 0; y <= node.state.length - 1; y++) {
            for (let x = 0; x <= node.state[0].length - 1; x++) {
                if (node.state[y][x] !== 0 && node.state[y][x] !== this.goalState.state[y][x]) {
                    
                    var currentIndex = node.flatState.indexOf(node.state[y][x]);
                    var goalIndex = this.goalState.flatState.indexOf(node.state[y][x]);
                    let h = Math.floor(Math.abs(Math.floor(currentIndex / this.puzzleSize) - Math.floor(goalIndex / this.puzzleSize)))
                    let w = Math.floor(Math.abs(Math.floor(currentIndex % this.puzzleSize) - Math.floor(goalIndex % this.puzzleSize)))
                    manhattanDistances = manhattanDistances + h + w
                }
            }
        }
        return manhattanDistances
    }

    execute() {
        this.openList = new TinyQueue([this.rootNode], sortNode);
        this.closedList = {};
        
        while (this.openList.length > 0 && !this.isFound) {
            // if (Object.keys(this.closedList).length % 1000 === 0) {
            //     console.log("CLOSED: ", Object.keys(this.closedList).length)
            // }
            var current = this.openList.pop()
            
            var children = this.getChildren(current);
            children.forEach(child => {
                // if successor is the goal, stop search
                // console.log(child.hash, this.goalState.hash)
                if (child.hash === this.goalState.hash) {
                    console.log("END")
                    
                    let n = child;
                    let nb = 0;
                    while (n.parent != null) {
                        n.draw()
                        n = n.parent
                        nb = nb + 1
                    }
                    console.log("nb: ", nb, "open: ", this.openList.length, "closed: ", Object.keys(this.closedList).length)
                    this.isFound = true;
                    return
                }
                
                if (this.closedList[child.hash] != null) {
                    return
                } else {
                var c = this.applyHeuristic(child, this.heuristic);
                c.scoreG = current.scoreG + 1;
                
                // if (openList.queue.contains(where: { $0 == c && $0.scoreF < c.scoreF })) {
                //     continue ;
                // }
                
                if (this.closedList[c.hash] != null) {
                    if (c.scoreF() > this.closedList[c.hash].scoreF()) {
                        ;
                    } else {
                        this.openList.push(c);
                    }
                } else {
                    this.openList.push(c);
                }
                
                // openList.push(c);
            }})

            this.closedList[current.hash] = current;
        }
    }

    getChildren(current) {
        var children = [];
        
        var states = current.findPossibleState()
        states.forEach(child => {
            var newNode = new Node(child, current);
            children.push(newNode);
        })
        return children
    }
    
}

export default Engine;