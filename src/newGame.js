let canvas = document.getElementById("gameScreen")
let ctx = canvas.getContext('2d')
//Canvas width and height
const GW = canvas.width;
const GH = canvas.height;
// Global variables because bad practice :)
const builds = ['warrior', 'rogue', 'mage', 'hunter']
let classPicked = false;
let build;
let player;
let colors = ['red', 'green', 'blue', 'magenta']
let qtrw = GW / 4;
let qtrh = GH / 4;
let playerInputName = "Jest";
let classPicks = [];
let choices = [];

class Character {
    constructor(name, build) {
        this.name = name;
        this.build = build;
    }
}
class Player extends Character {
    constructor(name, build) {
        super(name, build)
        this.xp = 0;
        this.level = 1;
        this.gold = 0;
    }
    assign() {
        switch (this.build) {
            case 'warrior':
                this.health = 30
                this.mana = 0;
                this.strength = 5;
                break;
        }
        switch (this.build) {
            case 'rogue':
                this.health = 15
                this.mana = 1;
                this.strength = 3;
                break;
        }
        switch (this.build) {
            case 'mage':
                this.health = 10
                this.mana = 5;
                this.strength = 2;
                break;
        }
        switch (this.build) {
            case 'hunter':
                this.health = 20
                this.mana = 2;
                this.strength = 4;
                break;
        }
    }
}
// Creates 4 boxes each representing a class
const uiClassChoice = () => {
    // starting text
    ctx.fillStyle = 'black';
    ctx.font = '56px sans-serif';
    ctx.fillText('Pick a class', GW / 3, GH / 6, 1000)
    // creating 4 blocks
    for (let i = 0; i < 4; i++) {
        let box = new Path2D();
        // adding a construcotr so we can identify our Path2D object
        box.constructor = builds[i]
        // each block and text pair are different colors
        ctx.fillStyle = colors[i];
        // drawing the box a little off from the wall and then qtr from the width times iterator
        box.rect(35 + (qtrw * i), qtrh, 175, 175);
        // filling in our boxes so we can see them
        ctx.fill(box);
        // adds our box obj to an array to call from later
        classPicks.push(box)
        ctx.font = '18px sans-serif';
        ctx.fillText(`${builds[i]}`, 100 + (qtrw * i), qtrh - 10)
    }
}
// Checks to see if user clicks on a class block
const classPicker = (e) => {
    for (let i = 0; i < classPicks.length; i++) {
        if (ctx.isPointInPath(classPicks[i], e.offsetX, e.offsetY)) {
            if (!classPicked) {
                switch (classPicks[i].constructor) {
                    case 'warrior':
                        classPicked = true
                        build = 'warrior'
                        player = new Player(playerInputName, build)
                        ctx.clearRect(0, 0, GW, GH)
                        player.assign();
                        gameLoop();
                        break;
                    case 'rogue':
                        classPicked = true
                        build = 'rogue'
                        player = new Player(playerInputName, build)
                        ctx.clearRect(0, 0, GW, GH)
                        player.assign();
                        gameLoop();
                        break;
                    case 'mage':
                        classPicked = true
                        build = 'mage'
                        player = new Player(playerInputName, build)
                        ctx.clearRect(0, 0, GW, GH)
                        player.assign();
                        gameLoop();
                        break;
                    case 'hunter':
                        classPicked = true
                        build = 'hunter'
                        player = new Player(playerInputName, build)
                        ctx.clearRect(0, 0, GW, GH)
                        player.assign();
                        gameLoop();
                        break;
                    default: console.log('no box')
                }
            }
        }
    }
}
const choiceArea = (e) => {
    // ctx.fillStyle ='#58E8A2'
    ctx.fillStyle = '#A89E60'
    ctx.rect(0, 0, GW, GH)
    ctx.fill()
}
const playArea = () => {
    // ctx.fillStyle = '#A89E60'
    ctx.strokeStyle = '#58E8A2'
    ctx.rect(0, 0, GW / 1.25, GH / 1.45)
    ctx.stroke()
}
const uiStats = () => {
    let i = 0;
    for (const keys in player){
        if (Object.hasOwnProperty.call(player, keys)){
            const element = player[keys];
            ctx.fillStyle = 'black';
            ctx.font = '20px sans-serif';
            ctx.fillText(`${keys.toUpperCase()}: ${element}`, 775, qtrh - 100 + (50 * i))
        }
        i++
    }

    // for(let i = 0; i < 8; i++){
    //     ctx.font = '18px sans-serif';
    //     ctx.fillText = `${Player.}`
    // }
    
}
canvas.addEventListener("click", classPicker)
uiClassChoice()
// The game starts after our initial user input. hopefully.
const gameLoop = () => {
    choiceArea()
    playArea()
    uiStats()
    // console.log(player);
    requestAnimationFrame(gameLoop);
}