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
let enemy;
let turnOrder;
let qtrw = GW / 4;
let qtrh = GH / 4;
let classPicks = [];
let choices = [];
let proceed = [];
let fightOptions = [];
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
            // inputBoxes();
            playArea();
        },
        getEnemy: (type) => {
            enemy = new Enemy(type, type);
            enemy[type]();
        },
        // TODO: Fight needs to have a ui to continue fighting or leaving
        // Nice to have: inv or other actions during fight
        startFight: () => {
            // Need to make this interactive not just a loop that shows the fight
            playArea();
            if(eventType !== 'midFight'){
                console.log('entered the start fight')
                ctx.fillText(`You have encountered a ${enemy.Build}!`, 10, 30)
                eventType = 'midFight';
            }
            if(player.Health <= 0) {
                return player.status();
            }
            // if(enemy.Health <= 0){
            // // playArea();
            // ctx.fillText(`You have defeated the ${enemy.Build}!`, 10, 30)
            // player.XP += (enemy.Strength + enemy.Agility + enemy.Mana + enemy.Health + enemy.Level)
            // }
            // else{
            //     if (player.Agility >= enemy.Agility){
            //         turnOrder = 'player'
            //         // playArea();
            //         ctx.fillText(`You attacked dealing ${player.Strength} damage!`, 10, 30)
            //         console.log('player should be retaliating PA>=EA')
            //         enemy.Health -= player.Strength;
            //         if(enemy.Health <= 0){
            //             // gameActions.startFight();
            //             gameActions.midFight();
            //         }
            //         turnOrder ='enemy'
            //         // playArea();
            //         ctx.fillText(`The ${enemy.Build} attacked for ${enemy.Strength}!`, 10, 30)
            //         player.Health -= enemy.Strength;
            //             gameActions.midFight();
            //     }
            //     else if (player.Agility < enemy.Agility){
            //         turnOrder = 'enemy';
            //         if(turnOrder == 'enemy'){
            //             // playArea();
            //             console.log('player should be retaliating PA<EA')
            //             turnOrder = 'player';
            //             enemy.Health -= player.Strength;
            //             if(enemy.Health <= 0){
            //                 gameActions.midFight();
            //             }
            //             ctx.fillText(`You attacked dealing ${player.Strength} damage!`, 10, 30)
            //                 // playArea();
            //                 ctx.fillText(`The ${enemy.Build} attacked for ${enemy.Strength}!`, 10, 30)
            //                 player.Health -= enemy.Strength;
            //                     gameActions.midFight();
            //         }
            //     }  
            // }
        },
        midFight: () =>{
            playArea();
            inputCreation(['Fight', 'Run', 'Heal'], 'decision', 95, (GH - 300), 150, 50, fightOptions, 135, (GH - 270), 100)
        }
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
        this.Agility = 2;
    }
    Rogue(){
        this.Health = 15;
        this.Mana = 1;
        this.Strength = 3;
        this.Agility = 5;
    }
    Mage(){
        this.Health = 10;
        this.Mana = 5;
        this.Strength = 2;
        this.Agility = 3;
    }
    Hunter(){
        this.Health = 20
        this.Mana = 2;
        this.Strength = 4;
        this.Agility = 4;
    }
    status() {
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
        if (this.XP >= 100){
            this.Health++;
            this.Level++;
            this.Mana++;
            this.Strength++;
            this.XP = 0;
        }
    }
}
class Enemy extends Character {
    constructor(Name, Build) {
        super(Name, Build)
        this.Level = player.Level + (Math.floor(Math.random() * player.Level));
    }
    Goblin(){
        this.Strength = 1 + this.Level;
        this.Mana = -1 + this.Level;
        this.Health = 5 + this.Level;
        this.Agility = 3 + this.Level;
        this.Gold = 5 + this.Level;
    }
    Orc(){
        this.Strength = 5 + this.Level;
        this.Mana = -3 + this.Level;
        this.Health = 15 + this.Level;
        this.Agility = 1 + this.Level;
        this.Gold = 10 + this.Level;

    }
    Bandit(){
        this.Strength = 3 + this.Level;
        this.Mana = -1 + this.Level;
        this.Health = 3 + this.Level;
        this.Agility = 5 + this.Level;
        this.Gold = 20 + this.Level;

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
        ctx.fillText('You find a tunnel. Do you want to look inside?', 10, 30);
    },
    Talk: () => {
        eventTriggered = true
        eventType = 'Talk'
        ctx.fillText('Hey you there! Want to talk?', 10, 30);
    },
    Fight: () => {
        eventTriggered = true
        eventType = 'Fight'
        ctx.fillText('Someone mean mugged you, fight?', 10, 30);
    },
    Rest: () => {
        eventTriggered = true
        eventType = 'Rest'
        ctx.fillText('Thats a nice hay bed there... Sleep?', 10, 30);
    }
}
const assignDecision = {
    Yes: () => {
        proceed = [];
        playArea()
        if(eventType == 'Fight'){
            gameActions.getEnemy(gameActions.getRandom(['Goblin', 'Orc', 'Bandit']))
            gameActions.startFight();
        }
        // if(eventType == 'midFight'){
        //     gameActions.midFight();
        // }
        if(eventType !== 'midFight'){
        let eventsDialog = gameActions.getRandom(Events[eventType])
        ctx.fillText(eventsDialog.Text ,10, 30)
        player.Gold += eventsDialog.Gold;
        player.Health += eventsDialog.Health;
        player.Mana += eventsDialog.Mana;
        player.Strength += eventsDialog.Strength;
        player.XP += eventsDialog.XP;
        if(player.Gold <= 0){
            player.Gold = 0;
        }}
        console.log('player should press something else')
        eventType = '';
        eventTriggered = false;
    },
    No: () => {
        proceed = [];
        playArea()
        setTimeout(() =>{
        eventTriggered = false;
        }, 100);}
}
const fightDecisions = {
    Fight: () => {},
    Run: () => {},
    Heal: () => {}
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
                inputCreation(['Yes', 'No'], 'decision', 150, (GH - 300), 200, 50, proceed, 225, (GH - 270), 100)                
            }
        }
    }
    for (let i = 0; i < proceed.length; i++){
        if(ctx.isPointInPath(proceed[i], e.offsetX, e.offsetY)){
            assignDecision[proceed[i].decision]()
        }
    }
    for (let i = 0; i < fightOptions.length; i++){
        if(ctx.isPointInPath(fightOptions[i], e.offsetX, e.offsetY)){
            console.log((fightOptions[i].decision))
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
        Health: -1,
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
    Fight: [],
    Rest: [{
        Gold: 0,
        Health: 5,
        Mana: 0,
        Strength: 0,
        XP: 0,
        Text: `You took a nice rest.`
    }]
}
const inputCreation = (array, definition, posX, posY, width, height, globalArr, textPosX, textPosY, maxWidth) => {
    for(let i = 0; i < array.length; i++) {
        // Creates an instance of Path2D which allows us to see if pointer is in the path of
        let button = new Path2D();
        // Makes the input boxes gray, we can make this dynamic if we wanted to
        ctx.fillStyle = 'gray';
        //What we want to call on the path2D obj, example button {decision: yes}
        button[definition] = array[i];
        // Where the input boxes sit on the canvas
        button.rect(posX + (qtrw * i), posY, width, height);
        console.log(posX, posY, width, height)
        // This is how we reference the boxes afterwards, I will probably take this out of global and just return results
        globalArr.push(button);
        // rendering the buttons on the canvas
        ctx.fill(button);
        // This will be the text on the input boxes
        ctx.fillStyle = 'black';
        // again this could be dynamic
        ctx.font = '28px sans-serif'
        ctx.fillText(`${array[i]}`, textPosX + (qtrw * i), textPosY, maxWidth)
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
    inputCreation(['Explore', 'Talk', 'Fight', 'Rest'],'choice', 50, (GH - 150), 125, 100, choices, 60, (GH - 100))
    uiStats();
    player.status()
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
    inputName = prompt('Enter your name')
    if(!inputName) {
        classPicked = false
        uiClassChoice()
    }
    inputName = inputName.trim();
    if(inputName.length <= 0 || inputName.length >= 15){
        alert('Enter a name greater than 0 but less than 15 characters!')
        playerInputName()
    }
    inputName = (inputName.charAt(0).toUpperCase() + inputName.slice(1))
    return inputName
}
canvas.addEventListener("click", clickHandler)
uiClassChoice()