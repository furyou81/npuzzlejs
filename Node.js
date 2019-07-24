const Direction = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
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

export default Node;