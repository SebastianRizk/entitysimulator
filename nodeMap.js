import Human from "./human.js";
let player = new Human(0, 0);

// For testing purposes
class simView {
    constructor() {
        this.nodemap = new NodeMap();
    }

    test() {
        setInterval(() => {this.movePlayer(0, 0)}, 250); // Move player every 250ms

    }


    movePlayer(xx, yy) {

        player.move(xx, yy);
        this.nodemap.runUpdate(); // Update the map
    }
}

// Data structure for an array of all stored nodes
class NodeMap {
    constructor() {
        this.index = [];
        this.map = document.getElementById("sim");
        this.runUpdate();
    }

    runUpdate() {
        let newIndex = this.generateNodeMap();
        this.mergeNodeMap(newIndex);
        this.paintEnabledNodes();
    }

    generateNodeMap() {
        console.log("Player x: " + player.getX() + " Player y: " + player.getY());
        let xCount = player.getX();
        let yCount = player.getY();
        let newMap = [];

        for (let i = player.getY(); i < player.getY() + 15; i++) {
            for (let j = player.getX(); j < player.getX() + 15; j++) {
                let node = new NodeIndex(xCount, yCount);
                newMap.push(node);
                xCount++;
            }
            xCount = player.getX();
            yCount++;
        }
        return newMap;
    }

    mergeNodeMap(newMap) {
        for (let i = 0; i < newMap.length; i++) {
            if(!this.itemExists(newMap[i].x, newMap[i].y)){
                this.index.push(newMap[i]);
            }
        }
    }

    // Adds enabled nodes to the html file and remove disabled nodes
    paintEnabledNodes() {

        let startX = player.getX();
        let startY = player.getY();
        let nextMap = [];
        this.index.sort((a,b) => {
            if ( a.y === b.y) return a.x - b.x;
            return a.y - b.y;
        })
        for (let i = 0; i < this.index.length; i++) {
            this.index[i].updateActive();
            if(!this.index[i].active && this.map.contains(this.index[i].node.element)){
                    this.map.removeChild(this.index[i].node.element);
            } else if (this.index[i].active){
                this.map.appendChild(this.index[i].node.element);
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
        this.node = new Node(x + ", " + y);
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
        let lowerBoundX = player.getX()
        let lowerBoundY = player.getY()
        let upperBoundX = player.getX() + 14;
        let upperBoundY = player.getY() + 14;


        this.active = lowerBoundX <= this.x && this.x <= upperBoundX && lowerBoundY <= this.y && this.y <= upperBoundY;


    }

    // Returns true if node is player, ie in the center of the screen
    nodeIsPlayer() {
        return this.x === (7 + player.getX()) && this.y === (7 + player.getY());
    }
}

// Data structure with node and creation data
class Node {
    constructor(xandy) {
        this.element = document.createElement("div");
        this.element.style.width = "50px";
        this.element.style.height = "50px";
        this.element.style.boxShadow = "inset 0 0 0 2px black";
        this.element.style.float = "left";
        this.element.innerHTML = xandy;
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
