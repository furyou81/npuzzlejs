var TinyQueue = require("tinyqueue");
const Direction = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
}

const Heuristic = {
    MISPLACEDTILES: 'misplacedTiles',
    EUCLIDEAN: 'euclidean',
    MANHATTAN: 'manhattan'
}

function sortNumber(a, b) {
    return a - b;
}

function sortNode(a, b) {
    return a.scoreF() - b.scoreF();
}


class Node {
    constructor(state, parent = null) {
        this.parent = parent;
        this.scoreG = parent != null ? parent.scoreG + 1 : 0;
        this.state = state;
        let hash = ""
        state.forEach(row => {
            row.forEach(column => {
                hash = hash + String(column);
            })
        });
        this.hash = hash;
        this.flatState = []
        state.forEach(row => {
            row.forEach(column => {
                this.flatState.push(column);
            })
        })
    }

    scoreF() {
        return this.scoreG + this.scoreH;
    }

    findPossibleState() {
        var possibleStates = [];
        var nilPosition = this.findNilPosition();
        var directions = this.findDirections(nilPosition);
        
        directions.forEach(direction => {
            var newState = this.swapState(nilPosition, direction);
            possibleStates.push(newState);
        })
        return possibleStates;
    }

    swapState(position, direction) {
        var newState = JSON.parse(JSON.stringify(this.state));
        // console.log("ICI", position, direction, newState)
        switch (direction) {
        case Direction.DOWN:
        // console.log("ICICICI")
            newState[position.y][position.x] = newState[position.y + 1][position.x]
            newState[position.y + 1][position.x] = 0
            break;
        case Direction.LEFT:
        // console.log("ISDSDSDDSDS")
            newState[position.y][position.x] = newState[position.y][position.x - 1]
            newState[position.y][position.x - 1] = 0
            break;
        case Direction.RIGHT:
            newState[position.y][position.x] = newState[position.y][position.x + 1]
            newState[position.y][position.x + 1] = 0
            break;
        case Direction.UP:
            // console.log("IPPP????", position, direction, Direction.UP)
            newState[position.y][position.x] = newState[position.y - 1][position.x]
            newState[position.y - 1][position.x] = 0
            break;
        }
        return newState;
    }

    findNilPosition() {
        for(let y = 0; y < this.state.length; y++) {
            for (let x = 0; x < this.state[0].length; x++) {
                if (this.state[y][x] === 0) {
                    return {x: x, y: y};
                }
            }
        }
    }

    findDirections(nilPosition) {
        var directions = [];
        if (nilPosition.y > 0) {
            directions.push(Direction.UP)
        }
        if (nilPosition.y < this.state.length - 1) {
            directions.push(Direction.DOWN)
        }
        if (nilPosition.x > 0) {
            directions.push(Direction.LEFT)
        }
        if (nilPosition.x < this.state[0].length - 1) {
            directions.push(Direction.RIGHT)
        }
        return directions
    }

    isEqual(node) {
        return this.hash === node.hash;
    }

    draw() {
        console.log(this.state);
    }

}

class Engine {
    constructor(rootNode, heuristic) {
        this.rootNode = rootNode;
        this.heuristic = heuristic;
        this.puzzleSize = rootNode.state.length;
        this.findGoal();
        this.isFound = false;
        this.nb = 0;
        console.log("RROOT", rootNode)
        this.rootNode = this.applyHeuristic(rootNode, heuristic);
        console.log("HEUR", this.rootNode.scoreH, this.rootNode.scoreG, this.rootNode.scoreF())
    }

    findGoal() {
        var goal= JSON.parse(JSON.stringify(this.rootNode.state));
        var numbers = [];
        for(let j = 0; j < goal.length; j++) {
            for (let i = 0; i < goal[0].length; i++) {
                numbers.push(goal[j][i]);
            }
        }
        // goal.forEach(row => {
        //     row.forEach(column => {
        //         numbers.push(column);
        //     })
        // })
        console.log(numbers)
        numbers = numbers.sort(sortNumber)
        numbers = numbers.slice(1, numbers.length)
        console.log(numbers)
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
        let manhattanDistances = 0
        if (this.nb === 0) {
            console.log("STATE", node.state)
        }
        for (let y = 0; y <= node.state.length - 1; y++) {
            for (let x = 0; x <= node.state[0].length - 1; x++) {
                if (this.nb === 0) {
                    console.log(y, x)
                }
                if (node.state[y][x] !== 0 && node.state[y][x] !== this.goalState.state[y][x]) {
                    
                    var currentIndex = node.flatState.indexOf(node.state[y][x]);
                    var goalIndex = this.goalState.flatState.indexOf(node.state[y][x]);
                    let h = Math.floor(Math.abs(Math.floor(currentIndex / this.puzzleSize) - Math.floor(goalIndex / this.puzzleSize)))
                    let w = Math.floor(Math.abs(Math.floor(currentIndex % this.puzzleSize) - Math.floor(goalIndex % this.puzzleSize)))
                    manhattanDistances = manhattanDistances + h + w
                    if (this.nb === 0) {
                        console.log("CURRETN INDEX", currentIndex, goalIndex)
                        console.log(Math.floor(currentIndex / this.puzzleSize), Math.floor(goalIndex / this.puzzleSize))
                        console.log(Math.floor(currentIndex % this.puzzleSize), Math.floor(goalIndex % this.puzzleSize))
                        console.log("NB", node.state[y][x], h, w)
                    }
                }
            }
        }
        // console.log("DISTANCE", manhattanDistances)
        return manhattanDistances
    }

    execute() {
        this.openList = new TinyQueue([rootNode], sortNode);
        this.closedList = {};
        
        while (this.openList.length > 0 && !this.isFound) {
            if (this.closedList.length % 1000 === 0) {
                console.log("CLOSED: ", this.closedList.length)
            }
            var current = this.openList.pop()
            
            var children = this.getChildren(current);
            if (this.nb === 0) {
                console.log("OPEN LIST", this.openList)
                console.log("CURRENT", current)
                console.log("CHILDREN", children)
            }
            this.nb++;
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