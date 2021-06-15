let canvas = document.getElementById("gameScreen")
let ctx = canvas.getContext('2d')
//Canvas width and height
const GW = canvas.width;
const GH = canvas.height;
// Global variables because bad practice :)
// our selection arrays
const Builds = ['Warrior', 'Rogue', 'Mage', 'Hunter']
const colors = ['red', 'green', 'blue', 'magenta']

let classPicked = false;
let Build;
let player;
let qtrw = GW / 4;
let qtrh = GH / 4;
let classPicks = [];
let choices = [];
let interval;

class Character {
    constructor(Name, Build) {
        this.Name = Name;
        this.Build = Build;
    }
}
class Player extends Character {
    constructor(Name, Build) {
        super(Name, Build)
        this.XP = 0;
        this.Level = 1;
        this.Gold = 0;
    }
    assign() {
        switch (this.Build) {
            case 'Warrior':
                this.Health = 30
                this.Mana = 0;
                this.Strength = 5;
                break;
        }
        switch (this.Build) {
            case 'Rogue':
                this.Health = 15
                this.Mana = 1;
                this.Strength = 3;
                break;
        }
        switch (this.Build) {
            case 'Mage':
                this.Health = 10
                this.Mana = 5;
                this.Strength = 2;
                break;
        }
        switch (this.Build) {
            case 'Hunter':
                this.Health = 20
                this.Mana = 2;
                this.Strength = 4;
                break;
        }
    }
    alive() {
        if (this.Health <= 0){
            ctx.fillStyle = 'black';
            ctx.clearRect(0,0, 1000, 1000)
            ctx.rect(0, 0, GW, GH);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '50px serif';
            ctx.fillText('You have died...', GW / 2 - 150, GH / 2, 300)
            clearInterval(interval)
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
        box.constructor = Builds[i]
        // each block and text pair are different colors
        ctx.fillStyle = colors[i];
        // drawing the box a little off from the wall and then qtr from the width times iterator
        box.rect(35 + (qtrw * i), qtrh, 175, 175);
        // filling in our boxes so we can see them
        ctx.fill(box);
        // adds our box obj to an array to call from later
        classPicks.push(box)
        // font over our boxes
        ctx.font = '18px sans-serif';
        ctx.fillText(`${Builds[i]}`, 100 + (qtrw * i), qtrh - 10)
    }
}
// Checks to see if user clicks on a class block
const classPicker = (e) => {
    for (let i = 0; i < classPicks.length; i++) {
        if (ctx.isPointInPath(classPicks[i], e.offsetX, e.offsetY)) {
            if (!classPicked) {
                switch (classPicks[i].constructor) {
                    case 'Warrior':
                        classPicked = true
                        Build = 'Warrior'
                        player = new Player(playerInputName(), Build)
                        player.assign();
                        interval = setInterval(gameLoop, 100);
                        break;
                    case 'Rogue':
                        classPicked = true
                        Build = 'Rogue'
                        player = new Player(playerInputName(), Build)
                        player.assign();
                        interval = setInterval(gameLoop, 100);
                        break;
                    case 'Mage':
                        classPicked = true
                        Build = 'Mage'
                        player = new Player(playerInputName(), Build)
                        player.assign();
                        interval = setInterval(gameLoop, 100);
                        break;
                    case 'Hunter':
                        classPicked = true
                        Build = 'Hunter'
                        player = new Player(playerInputName(), Build)
                        player.assign();
                        interval = setInterval(gameLoop, 100);
                        break;
                    default: console.log('no box')
                }
            }
        }
    }
}
const choiceArea = () => {
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
            ctx.fillText(`${keys}: ${element}`, 775, qtrh - 100 + (50 * i))
        }
        i++
    }
}
const playerInputName = () => {
    let inputName = prompt('Enter your name');
    if(inputName.length <= 0 || inputName.length >= 15){
        alert('Enter a name greater than 0 but less than 15 characters!')
        playerInputName()
    }
    inputName = (inputName.charAt(0).toUpperCase() + inputName.slice(1))
    return inputName
}
canvas.addEventListener("click", classPicker)
uiClassChoice()
// The game starts after our initial user input. hopefully.
const gameLoop = () => {
    ctx.clearRect(0, 0, GW, GH)
    choiceArea()
    playArea()
    uiStats()
    player.alive()
}
