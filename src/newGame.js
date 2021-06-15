let canvas = document.getElementById("gameScreen")
let ctx = canvas.getContext('2d')
//Canvas width and height
const GW = canvas.width;
const GH = canvas.height;
// Global variables because bad practice :)

let classPicked = false;
let eventTriggered = false;
let eventType;
let Build;
let player;
let qtrw = GW / 4;
let qtrh = GH / 4;
let classPicks = [];
let choices = [];
let proceed = [];
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
    // our selection arrays
    const Builds = ['Warrior', 'Rogue', 'Mage', 'Hunter']
    const colors = ['red', 'green', 'blue', 'magenta']
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
// Checks to see if where user clicks on input boxes
const clickHandler = (e) => {
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
                        inputBoxes()
                        break;
                    case 'Rogue':
                        classPicked = true
                        Build = 'Rogue'
                        player = new Player(playerInputName(), Build)
                        player.assign();
                        interval = setInterval(gameLoop, 100);
                        inputBoxes()
                        break;
                    case 'Mage':
                        classPicked = true
                        Build = 'Mage'
                        player = new Player(playerInputName(), Build)
                        player.assign();
                        interval = setInterval(gameLoop, 100);
                        inputBoxes()
                        break;
                    case 'Hunter':
                        classPicked = true
                        Build = 'Hunter'
                        player = new Player(playerInputName(), Build)
                        player.assign();
                        interval = setInterval(gameLoop, 100);
                        inputBoxes()
                        break;
                    default: console.log('no box')
                }
            }
        }
    }
    for (let i = 0; i < choices.length; i++) {
        if(ctx.isPointInPath(choices[i], e.offsetX, e.offsetY)){
            if(!eventTriggered){
                switch (choices[i].constructor){
                    case 'Explore':
                        eventTriggered = true
                        eventType = 'Explore'
                        clearInterval(interval)
                        yesNo();
                        ctx.fillText('You find a tunnel. Do you want to look inside?', 10, 30);
                        break;
                    case 'Talk':
                        eventTriggered = true
                        eventType = 'Talk'
                        clearInterval(interval)
                        yesNo();
                        ctx.fillText('Hey you there! Want to talk?', 10, 30);
                        break;
                    case 'Fight':
                        eventTriggered = true
                        eventType = 'Fight'
                        clearInterval(interval)
                        yesNo();
                        ctx.fillText('Someone mean mugged you, fight?', 10, 30);
                        break;
                    case 'Rest':
                        eventTriggered = true
                        eventType = 'Rest'
                        clearInterval(interval)
                        yesNo();
                        ctx.fillText('Thats a nice hay bed there... Sleep?', 10, 30);
                        break;
                }
            }
        }
    }
    for (let i = 0; i < proceed.length; i++){
        if(ctx.isPointInPath(proceed[i], e.offsetX, e.offsetY)){
            switch(eventType){
                case 'Explore':
                    if(proceed[i].constructor == 'Yes'){
                        let eventsDialog = getRandom(exploreEvents)
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
                        interval = setInterval(gameLoop, 100);
                        }, 3000);
                    }
                    else{ 
                        proceed = [];
                        setTimeout(() =>{
                        eventTriggered = false;
                        interval = setInterval(gameLoop, 100);
                        }, 100);
                    }
                    break;
                case 'Talk':
                    if(proceed[i].constructor == 'Yes'){
                        let eventsDialog = getRandom(talkEvents)
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
                        interval = setInterval(gameLoop, 100);
                        }, 3000);
                    }
                    else{ 
                        proceed = [];
                        setTimeout(() =>{
                        eventTriggered = false;
                        interval = setInterval(gameLoop, 100);
                        }, 100);
                    }
                    break;
                case 'Fight':
                    if(proceed[i].constructor == 'Yes'){
                        let eventsDialog = getRandom(fightEvents)
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
                        interval = setInterval(gameLoop, 100);
                        }, 3000);
                    }
                    else{ 
                        proceed = [];
                        setTimeout(() =>{
                        eventTriggered = false;
                        interval = setInterval(gameLoop, 100);
                        }, 100);
                    }
                    break;
                case 'Rest':
                    if(proceed[i].constructor == 'Yes'){
                        let eventsDialog = getRandom(restEvents)
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
                        interval = setInterval(gameLoop, 100);
                        }, 3000);
                    }
                    else{ 
                        proceed = [];
                        setTimeout(() =>{
                        eventTriggered = false;
                        interval = setInterval(gameLoop, 100);
                        }, 100);
                    }
                    break;
            }
        }
    }
}
const getRandom = (arr) => {
    let randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}
const exploreEvents = [
    {
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
    },
]
const talkEvents = [
    {
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
    },
]
const fightEvents = [
    {
        Gold: 0,
        Health: -100,
        Mana: 0,
        Strength: 0,
        XP: 0,
        Text: `WE HAVEN'T TAUGHT YOU TO FIGHT?!`
    }
]
const restEvents = [
    {
        Gold: 0,
        Health: 5,
        Mana: 0,
        Strength: 0,
        XP: 0,
        Text: `You took a nice rest.`
    }]
const yesNo = () => {
    const yesorNo = ['Yes', 'No'];
    for(let i = 0; i < 2; i++){
        let button = new Path2D();;
        ctx.fillStyle = 'gray';
        button.constructor = yesorNo[i];
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
        button.constructor = Choices[i];
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
        ctx.fillText(`${choices[i].constructor}`, 60 + (qtrw * i), GH - 100)
    }
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
canvas.addEventListener("click", clickHandler)
uiClassChoice()
// The game starts after our initial user input. hopefully.
const gameLoop = () => {
    ctx.clearRect(0, 0, GW, GH)
    playArea()
    uiStats()
    player.alive()
}
