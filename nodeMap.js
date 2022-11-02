import Human from "./human.js";
let player = new Human(0, 0);

// For testing purposes
class simView {
    constructor() {
        this.nodemap = new NodeMap();
    }

    test() {
        this.movePlayer(0,0); // Otherwise it will start on blank screen
        setInterval(() => {this.movePlayer(0, 1)}, 250); // Move player every 250ms


    }
    movePlayer(xx, yy) {

        player.move(xx, yy); // Move player xx units in x and yy units in y
        // TODO: ONLY WORKS DOWN AND JUMPS AT START
        this.nodemap.runUpdate(); // Update the map
    }
}

// Data structure for an array of all stored nodes
class NodeMap {
    constructor() {
        this.index = [];
        this.index = this.generateNodeMap();
        this.map = document.getElementById("sim");
    }

    runUpdate() {
        this.index = this.generateNodeMap();
        this.paintEnabledNodes();
    }

    generateNodeMap(){

        // TODO: Can only move down FIX
        let test = 0;
        let buffer = [];
        let xCount = player.getX(); // Get "player" x position actually top right corner of map that you can see
        let yCount = player.getY(); // Get "player" y position
        for(let i = player.getX(); i < player.getX() + 15; i++){



            for (let j = player.getY(); j < player.getY() + 15; j++) {

                // if node already exists in index then skip it
                // if it exists then it will be inserted into the buffer which will add the node at the end of the index
                if(this.index[test] !== undefined){
                    if(!this.itemExists(xCount, yCount)){
                        buffer.push(new NodeIndex(xCount,yCount));
                    }
                    test++;
                    yCount++;
                    continue;
                }

                // Add node to index
                let node = new NodeIndex(xCount, yCount);
                this.index[test++] = node;
                yCount++;
            }
            // Reset yCount
            yCount = player.getY();
            xCount++;
        }

        for (let i = 0; i < buffer.length; i++) {

            this.index.push(buffer[i]);
        }

        return this.index;
    }

    // Adds enabled nodes to the html file and remove disabled nodes
    paintEnabledNodes() {
        for (let i = 0; i < this.index.length; i++) {
            this.index[i].updateActive();
            if(this.index[i].active){
                this.map.appendChild(this.index[i].node.element);
            } else if ( this.index[i].node.element.parentNode === this.map) {
                this.map.removeChild(this.index[i].node.element);
            }
        }
    }

    // Checks if item exists in index
    itemExists(xCount, yCount) {
        for (let i = 0; i < this.index.length; i++) {
            if(this.index[i].x === xCount && this.index[i].y === yCount){
                return true;
            }
        }
        return false;
    }
}

// Data structure for a single node
class NodeIndex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.active = false;
        this.node = new Node();
    }
    updateActive() {

        // Check if node is player
        if(this.nodeIsPlayer()){ // If node is player, paint it red
            this.node.paint("red")
        }else if (this.node.getPaint() === "red"){// If it was red, paint it white
            this.node.paint("white");
        }else if (Math.random() < 0.0005){ // Growt rate
            this.node.paint("green");
        } else if (Math.random() < 0.01 && this.node.getPaint() === "green"){ // Decay rate
            this.node.paint("white");
        }


        this.active = this.x >= player.getX() && this.x <= player.getX() + 14 && this.y >= player.getY() && this.y <= player.getY() + 14;
        return;
    }

    // Returns true if node is player, ie in the center of the screen
    nodeIsPlayer() {
        return this.x === 7 + player.getX() && this.y === 7 + player.getY();
    }
}

// Data structure with node and creation data
class Node {
    constructor() {
        this.element = document.createElement("div");
        this.element.style.width = "50px";
        this.element.style.height = "50px";
        this.element.style.boxShadow = "inset 0 0 0 2px black";
        this.element.style.float = "left";
        if (Math.random() < 0.1){ // 10% chance of node being green
            this.element.style.backgroundColor = "green";
        } else {
            this.element.style.backgroundColor = "white";
        }
    }
    paint(color) {
        this.element.style.backgroundColor = color;
    }
    getPaint() {
        return this.element.style.backgroundColor;
    }
}

let simulator = new simView();
simulator.test();
