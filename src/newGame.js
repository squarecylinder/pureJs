let canvas = document.getElementById("gameScreen")
let ctx = canvas.getContext('2d')
//Canvas width and height
const GW = canvas.width;
const GH = canvas.height;
// Global variables because bad practice :)
let classPicked = false;
let eventTriggered = false;
let eventType;
let player;
let qtrw = GW / 4;
let qtrh = GH / 4;
let classPicks = [];
let choices = [];
let proceed = [];
let interval;
// our game actions module
const game = () =>{
    return {
        getRandom: (arr) => {
            let randomIndex = Math.floor(Math.random() * arr.length);
            return arr[randomIndex];
        },
        getPlayer: (Build) => {
            player = new Player(playerInputName(), Build);
            player[Build]();
            inputBoxes();
            playArea();
            uiStats();
        },
    }
}
// saving our module as a variable
const gameActions = game()
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
    Warrior() {
        this.Health = 30;
        this.Mana = 0;
        this.Strength = 5;
    }
    Rogue(){
        this.Health = 15;
        this.Mana = 1;
        this.Strength = 3;
    }
    Mage(){
        this.Health = 10;
        this.Mana = 5;
        this.Strength = 2;
    }
    Hunter(){
        this.Health = 20
        this.Mana = 2;
        this.Strength = 4;
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
    // our selection arrays
    const Builds = ['Warrior', 'Rogue', 'Mage', 'Hunter']
    const colors = ['red', 'green', 'blue', 'magenta']
    // starting text
    ctx.fillStyle = 'black';
    ctx.font = '56px sans-serif';
    ctx.fillText('Pick a class', GW / 3, GH / 6, 1000)
    // creating 4 blocks
    const createBlocks = (i) => {
        let box = new Path2D();
        // adding a construcotr so we can identify our Path2D object
        box.build = Builds[i]
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
        ctx.fillText(`${Builds[i]}`, 100 + (qtrw * i), qtrh - 10)}
    for (let i = 0; i < 4; i++) {
        createBlocks(i)
    }
}
// Create an object with methods that creates a new instance of the player class.
const assignBuild = { 
    Warrior: () => {
        classPicked = true
        gameActions.getPlayer('Warrior')
    },
    Rogue: () => {
        classPicked = true
        gameActions.getPlayer('Rogue')
    },
    Mage: () => {
        classPicked = true
        gameActions.getPlayer('Mage')
    },
    Hunter: () => {
        classPicked = true
        gameActions.getPlayer('Hunter')
    }
}
const assignEvents = {
    Explore: () => {
        eventTriggered = true
        eventType = 'Explore'
        clearInterval(interval)
        ctx.fillText('You find a tunnel. Do you want to look inside?', 10, 30);
    },
    Talk: () => {
        eventTriggered = true
        eventType = 'Talk'
        clearInterval(interval)
        ctx.fillText('Hey you there! Want to talk?', 10, 30);
    },
    Fight: () => {
        eventTriggered = true
        eventType = 'Fight'
        clearInterval(interval)
        ctx.fillText('Someone mean mugged you, fight?', 10, 30);
    },
    Rest: () => {
        eventTriggered = true
        eventType = 'Rest'
        clearInterval(interval)
        ctx.fillText('Thats a nice hay bed there... Sleep?', 10, 30);
    }
}
const assignDecision = {
    Yes: () => {
        let eventsDialog = gameActions.getRandom(Events[eventType])
        proceed = [];
        playArea();
        uiStats();
        ctx.fillText(eventsDialog.Text ,10, 30)
        player.Gold += eventsDialog.Gold;
        player.Health += eventsDialog.Health;
        player.Mana += eventsDialog.Mana;
        player.Strength += eventsDialog.Strength;
        player.XP += eventsDialog.XP;
        setTimeout(() =>{
        eventTriggered = false;
        playArea();
        uiStats();
        }, 3000);
    },
    No: () => {
        proceed = [];
        setTimeout(() =>{
        eventTriggered = false;
        }, 100);}
}
// Checks to see if where user clicks on input boxes
const clickHandler = (e) => {
    for (let i = 0; i < classPicks.length; i++) {
        if (ctx.isPointInPath(classPicks[i], e.offsetX, e.offsetY)) {
            if (!classPicked) {
                // if classes aren't picked yet, we go to assign build object.
                assignBuild[classPicks[i].build]();
                }
            }
        }
    for (let i = 0; i < choices.length; i++) {
        if(ctx.isPointInPath(choices[i], e.offsetX, e.offsetY)){
            if(!eventTriggered){
                // If an event wasn't triggered fire
                assignEvents[choices[i].choice]()
                yesNo();
            }
        }
    }
    for (let i = 0; i < proceed.length; i++){
        if(ctx.isPointInPath(proceed[i], e.offsetX, e.offsetY)){
            assignDecision[proceed[i].decision]()
        }
    }
}
// Add all of the events in an object with objects with arrays woooh, that was a long one
const Events = {
    Explore: [{
        Gold: 10,
        Health: -1,
        Mana: 0,
        Strength: 0,
        XP: 0,
        Text: `You reach into a crack, your stub your finger but find 10 Gold!`
    },
    {
        Gold: 0,
        Health: 1,
        Mana: 1,
        Strength: 1,
        XP: 1,
        Text: `You feel invigorated! All stats increased by 1!`
    },
    {
        Gold: -10,
        Health: -5,
        Mana: 0,
        Strength: 0,
        XP: 0,
        Text: `You weren't paying attention, robbers make quick work of your pockets!`
    }],
    Talk: [{
        Gold: 0,
        Health: 0,
        Mana: 0,
        Strength: 0,
        XP: 0,
        Text: `You talk some gossip for awhile...`
    },
    {
        Gold: 0,
        Health: 1,
        Mana: 1,
        Strength: 1,
        XP: 1,
        Text: `Someone tells you a trick that doctors hate! All stats increased by 1!`
    },
    {
        Gold: 0,
        Health: -1,
        Mana: -1,
        Strength: -1,
        XP: -1,
        Text: `You never talked to someone so stupid before... All stats decreased by 1!`
    }],
    Fight: [{
        Gold: 0,
        Health: -100,
        Mana: 0,
        Strength: 0,
        XP: 0,
        Text: `WE HAVEN'T TAUGHT YOU TO FIGHT?!`
    }],
    Rest: [{
        Gold: 0,
        Health: 5,
        Mana: 0,
        Strength: 0,
        XP: 0,
        Text: `You took a nice rest.`
    }]
}
const yesNo = () => {
    const yesorNo = ['Yes', 'No'];
    for(let i = 0; i < 2; i++){
        let button = new Path2D();
        ctx.fillStyle = 'gray';
        button.decision = yesorNo[i];
        button.rect(150 + (qtrw * i), GH - 300, 200, 50);
        proceed.push(button);
        ctx.fill(button);
        ctx.fillStyle = 'black';
        ctx.font = '28px sans-serif'
        ctx.fillText(`${yesorNo[i]}`, 225 + (qtrw * i), GH - 270, 100)
    }
}
//Creates four input boxes
const inputBoxes = () => {
    const Choices = ['Explore', 'Talk', 'Fight', 'Rest']
    ctx.fillStyle = '#A89E60'
    ctx.rect(0, 0, GW, GH)
    ctx.fill()
        for(let i = 0; i < 4; i++){
        let button = new Path2D();
        button.choice = Choices[i];
        button.rect(50 + (qtrw * i), GH - 150 , 125, 100);
        choices.push(button)
        }
}
// our play area
const playArea = () => {
    ctx.fillStyle = '#A89E60'
    ctx.rect(0, 0, GW, GH)
    ctx.fill()
    ctx.strokeStyle = '#58E8A2'
    ctx.rect(0, 0, GW / 1.25, GH / 1.45)
    ctx.stroke()
    for(let i = 0; i < 4; i++){
        ctx.fillStyle = 'gray';
        ctx.fill(choices[i]);
        ctx.fillStyle = 'black';
        ctx.font = '28px sans-serif'
        ctx.fillText(`${choices[i].choice}`, 60 + (qtrw * i), GH - 100)
    }
    player.alive()
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
    inputName = prompt('Enter your name').trim();
    if(inputName.length <= 0 || inputName.length >= 15){
        alert('Enter a name greater than 0 but less than 15 characters!')
        playerInputName()
    }
    inputName = (inputName.charAt(0).toUpperCase() + inputName.slice(1))
    return inputName
}
canvas.addEventListener("click", clickHandler)
uiClassChoice()