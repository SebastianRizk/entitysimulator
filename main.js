
function generateFood(x, y, f){
    let foodMap = []
    let ones = 0
    for (let i = 0; i < x*y; i++) {
        if(Math.random() < f) {
            foodMap[i] = 1
            ones++
        } else{
            foodMap[i] = 0
        }
    }
    console.log(ones)
    return foodMap
}


class Human {
    constructor(score) {
        this.posX = 0;
        this.posY = 0;
        this.posXold = 0;
        this.posYold = 0;
        this.score = score;
    }

    move(x, y) {

        let nextX = this.posX + x
        let nextY = this.posY + y

        if (0 <= nextX && nextX <= 19 && 0 <= nextY && nextY <= 13) {
            this.posXold = this.posX
            this.posX = this.posX + x
            this.posYold = this.posY
            this.posY = this.posY + y
            if (game.world.nodes[nextX + nextY * 20].style.backgroundColor === "green") {
                this.score++
            }
        }

    }

    oldPos() {
        return this.posXold + this.posYold * 20
    }

    newPos() {
        return this.posX + this.posY * 20
    }

    draw() {
        game.world.nodes[this.oldPos()].style.backgroundColor = "white"
        game.world.nodes[this.newPos()].style.backgroundColor = "red"
    }
}

class Game {
    constructor(human, world) {
        this.human = human
        this.world = world
        this.scoreBoard = document.getElementById("score")
        this.restartButton = document.getElementById("restartButton")
        this.restartButton.onclick = () => {location.reload()}
    }

    draw() {
        this.human.draw()
        this.scoreBoard.innerHTML = "Score is " + this.human.score
    }
}

class World{
    constructor() {
        this.nodes = this.createMap()
    }

    createMap() {
        let nodes = []

        let foodMap = generateFood(20,14,0.1)

        for (let i = 0; i < 280; i++) {
            nodes[i] = document.createElement("div")
            nodes[i].style.width = "50px"
            nodes[i].style.height = "50px"
            nodes[i].style.float = "left"
            if (i !== 0 && foodMap[i] === 1) {
                nodes[i].style.backgroundColor = "green"
            } else {
                nodes[i].style.backgroundColor = "white"
            }
            nodes[i].style.boxShadow = "inset 0 0 0 2px black"
            document.getElementById("sim").appendChild(nodes[i])
        }

        return nodes
    }
}

let state = {
    actionPerformed : true,
    pressedKeys: {
        left: false,
        right: false,
        up: false,
        down: false
    }
}

const keyMap = {
    39: 'right',
    37: 'left',
    40: 'up',
    38: 'down'
}

let human = new Human(0)
let world = new World()
let game = new Game(human, world)




function keydown(event) {
    console.log(event)
    let key = keyMap[event.keyCode]
    state.pressedKeys[key] = true
    state.actionPerformed = false
}

function keyup(event) {
    let key = keyMap[event.keyCode]
    state.pressedKeys[key] = false
}

window.addEventListener("keydown", keydown, false)
window.addEventListener("keyup", keyup, false)


function update(progress) {

    if (state.pressedKeys.left && !state.actionPerformed) {
        human.move(-1, 0)
        state.actionPerformed = true
    }
    if (state.pressedKeys.right && !state.actionPerformed) {
        human.move(1, 0)
        state.actionPerformed = true
    }
    if (state.pressedKeys.up && !state.actionPerformed) {
        human.move(0, 1)
        state.actionPerformed = true
    }
    if (state.pressedKeys.down && !state.actionPerformed) {
        human.move(0, -1)
        state.actionPerformed = true
    }

}


function draw(){
    game.draw()
}

function loop(timestamp) {
    let progress = timestamp - lastRender

    update(progress)
    draw()

    lastRender = timestamp
    window.requestAnimationFrame(loop)
}
let lastRender = 0
window.requestAnimationFrame(loop)