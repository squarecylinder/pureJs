let ctx = document.getElementById("gameScreen").getContext('2d')
//Canvas width and height
const GW = document.documentElement.clientWidth - 50;
const GH = document.documentElement.clientHeight - 50;
ctx.canvas.width = GW
ctx.canvas.height = GH;
// state of key press
let rightPressed = false;
let leftPressed = false;
let score = 0;
// Defines the angle of the balls starting pos
class HitBox {
}
// Ball class
class Ball {
    // Size of the ball and how it
    constructor(){
        this.ballX = GW / 2;
        this.ballY = GH - 100;
        this.radius = 8;
        this.direction = Math.random() * Math.PI * 2;
        this.speed = Math.ceil(Math.random() * 5);
    }
    // How we draw a ball shape
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
    update(){
        let trash = bricks.map(trashIt => 
            {if(trashIt.position.x == ball.ballX){
                console.log(trashIt)
            }
        })
        // Changes direction of ball
        this.ballX += Math.cos(this.direction)  * this.speed
        this.ballY += Math.sin(this.direction) * this.speed
        if(this.ballX - this.radius < 0){
            this.ballX = this.radius;
            this.direction = Math.atan2(Math.sin(this.direction), -Math.cos(this.direction))
        }
        if(this.ballX + this.radius > GW){
            this.ballX = GW - this.radius;
            this.direction = Math.atan2(Math.sin(this.direction), -Math.cos(this.direction))
        }
        if(this.ballY - this.radius < 0){
            this.ballY = this.radius;
            this.direction = Math.atan2(-Math.sin(this.direction), Math.cos(this.direction))
        }
        // Ball & Paddle Collision
        if(this.ballY == paddle.position.y || 
            (
            this.ballY > (GH - paddle.height - this.radius) &&
            this.ballX > paddle.position.x &&
            this.ballX < (paddle.position.x + paddle.width)
            ) 
        ){
            score++
            this.direction = Math.atan2(-Math.sin(this.direction), Math.cos(this.direction));
        }
        else if(this.ballY + this.direction > GH){
            location.reload()
        }
    }
}

// Paddle class
class Paddle {
    constructor() {
        this.width = 150;
        this.height = 20;
        this.position = {
            x: (GW - this.width) / 2,
            y: GH - this.height - 10
        }
        this.leftSide = this.position.x - (this.position.x / 2)
    }
    // Drawing a paddle
    draw(ctx){
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.width, this.height)
        ctx.fillStyle = '#7fcab4';
        ctx.fill()
        ctx.closePath()
    }
    // Updates left or right based on input
    update(lp, rp){
    if(rp && (this.position.x + this.width) < GW ){
        this.position.x += 10;
        rp = false
        }
    if(lp && this.position.x > 0){
        this.position.x += -10;
        lp = false
        }
    }
}
class Brick {
    constructor(posX, posY){
        this.width = GW / 10;
        this.height = 30;
        this.position = {
            x: 100 + (posX * 150 - (this.width / 10)),
            y: 125 + (posY * 50)
        }
    }
}
// Instation
let bricks = [];
for (let i = 0; i < 20; i++){
    bricks.push(new Brick(i, 0))
    let brick = bricks[i];
    if(brick.position.x + brick.width > GW){
        bricks.push(new Brick((bricks.length - 1) - i, 1))
    }
}
let ball = new Ball()
let paddle = new Paddle();
// Checks input for movement
const startMovement = (e) => {
    if(e.code === 'KeyA' || e.code === 'ArrowLeft'){
        leftPressed = true
    }
    if(e.code === 'KeyD' || e.code === 'ArrowRight'){
        rightPressed = true
    }
}
const stopMovement = (e) => {
    if(e.code === 'KeyA' || e.code === 'ArrowLeft'){
        leftPressed = false
    }
    if(e.code === 'KeyD' || e.code === 'ArrowRight'){
        rightPressed = false
    }
}
const uiScore = () => {
    ctx.font = '18px sans-serif';
    ctx.fillText(`Score: ${score}`, 0, 15);
}
const uiSpeed = () => {
    ctx.font = '18px serif';
    ctx.fillText(`Speed: ${ball.speed}`, 100, 15)
}
// The loop
const gameLoop = () => {
    document.addEventListener("keydown", startMovement);
    document.addEventListener("keyup", stopMovement);
    ctx.clearRect(0, 0, GW, GH);
    uiScore(ctx);
    uiSpeed(ctx);
    // changes the ball movement
    ball.update(ctx);
    ball.draw(ctx);
    paddle.draw(ctx);
    paddle.update(leftPressed, rightPressed);
    for(let i = 0; i < bricks.length; i++){
        let brick = bricks[i];
        if(brick.position.x + brick.width < GW){
            ctx.beginPath();
            ctx.rect(brick.position.x, brick.position.y, brick.width, brick.height)
            ctx.fillStyle = '#4fcab0';
            ctx.fill()
            ctx.closePath()
        }
    }
    // Calls the loop again
    requestAnimationFrame(gameLoop);
}
// setTimeout(gameLoop, 1000 / 60)
// Requests the loop every frame
requestAnimationFrame(gameLoop);
let trash = bricks.map(trashIt => 
    {if(trashIt.position.x == ball.ballX){
        console.log(trashIt)
    }
})