const Direction = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
}

class Node {
    constructor(state, parent = null, nilPosition) {
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
        this.nilPosition = nilPosition;
    }

    scoreF() {
        return this.scoreG + this.scoreH;
    }

    findPossibleState() {
        var possibleStates = [];
        // var nilPosition = this.findNilPosition();
        var directions = this.findDirections(this.nilPosition);
        
        directions.forEach(direction => {
            var newState = this.swapState(this.nilPosition, direction);
            possibleStates.push(newState);
        })
        return possibleStates;
    }

    swapState(position, direction) {
        var newState = this.state.map(function(arr) {
            return arr.slice();
        });
        switch (direction) {
        case Direction.DOWN:
            newState[position.y][position.x] = newState[position.y + 1][position.x]
            newState[position.y + 1][position.x] = 0
            break;
        case Direction.LEFT:
            newState[position.y][position.x] = newState[position.y][position.x - 1]
            newState[position.y][position.x - 1] = 0
            break;
        case Direction.RIGHT:
            newState[position.y][position.x] = newState[position.y][position.x + 1]
            newState[position.y][position.x + 1] = 0
            break;
        case Direction.UP:
            newState[position.y][position.x] = newState[position.y - 1][position.x]
            newState[position.y - 1][position.x] = 0
            break;
        }
        return newState;
    }

    static findNilPosition(state) {
        for(let y = 0; y < state.length; y++) {
            for (let x = 0; x < state[0].length; x++) {
                if (state[y][x] === 0) {
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

export default Node;