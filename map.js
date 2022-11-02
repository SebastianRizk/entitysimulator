const DECAY_RATE = 0.01;
const GROWTH_RATE = 0.0005;
let xCount = 0;
let yCount = 0;

/// OLD CODE ///////////////// TOBE DELETED /////////////////////////

class Map {
    constructor() {
        this.map = document.getElementById("sim");
        this.chunks = []
        this.chunks = this.generateChunks()

    }

    simulateChunks() {
        for (let i = 0; i < this.chunks.length; i++) {
            this.chunks[i].simulateNodes();
        }
    }

    generateChunks() {
        for (let i = xCount; i < xCount + 5; i++) {
            for (let j = yCount; j < yCount + 5; j++){
                if(this.chunks[i + j * 5] !== undefined){
                    continue;
                } else {
                    this.chunks[i + j * 5] = new Chunk(xCount + i, yCount + j);
                }
            }
        }
        return this.chunks;
    }

}

class gameView {
    constructor() {
        this.map = new Map();
        this.chunkMap = []

        //TODO update when player moves
        setInterval(() => {this.chunkMap = this.map.generateChunks()}, 1000);

        this.invisibleChunks = []

    }

    paintEnabledChunks() {
        let minX = xCount;
        let maxX = xCount + 3;
        let minY = yCount;
        let maxY = yCount + 3;

        let minXOffset = 0;



    }

}

class Chunk {
    constructor(x,y) {
        this.chunk = document.createElement("div");
        this.chunk.style.width = "250px";
        this.chunk.style.height = "250px";
        this.chunk.style.float = "left";
        this.x = x;
        this.y = y;
        this.nodes = [];
        this.nodes = this.generateNodes();
    }
    generateNodes() {

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.nodes[i + j * 5] = new Node();
                this.chunk.appendChild(this.nodes[i + j * 5].element);
            }
        }
        return this.nodes;
    }

    simulateNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].simulate();
        }
    }

    setNode(x,y, color) {
        this.nodes[x + y * 5].element.style.backgroundColor = color;
    }
    getNode(x,y,color) {
        return this.nodes[x + y * 5].element.style.backgroundColor;
    }

}

class Node {
    constructor() {
        this.element = document.createElement("div");
        if(Math.random() < 0.1){
            this.element.style.backgroundColor = "green";
        }else {
            this.element.style.backgroundColor = "white";
        }
        this.element.style.width = "50px";
        this.element.style.height = "50px";
        this.element.style.boxShadow = "inset 0 0 0 2px black";
        this.element.style.float = "left";
    }
    simulate() {
        if (this.getColor() === "red") {
            return;
        }
        if(Math.random() < DECAY_RATE && this.getColor() === "green"){
            this.setColor("white");
        }
        if(Math.random() < GROWTH_RATE && this.getColor() === "white"){
            this.setColor("green");
        }
    }
    setColor(color) {
        this.element.style.backgroundColor = color;
    }
    getColor() {
        return this.element.style.backgroundColor;
    }
}

let game = new gameView();

