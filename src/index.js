let ctx = document.getElementById("gameScreen").getContext('2d')

//Canvas width and height
const GW = 600;
const GH = 450;
// state of key press
let rightPressed = false;
let leftPressed = false;

let score = 0;
// Defines the angle of the balls starting pos
let strBallYDir = Math.ceil(Math.random() * 4);
// Defines if ball points left or right to begin
let strBallXDir = Math.ceil(Math.random() * 5) * (Math.round(Math.random()) ? 1 : -1);
console.log(strBallXDir)
// Ball class
class Ball {
    // Size of the ball and how it
    constructor(){
        this.ballX = GW / 2;
        this.ballY = GH - 50;
        this.radius = 8;
        this.delta = {
            dx: strBallXDir,
            dy: -strBallYDir
        }
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
        // Changes direction of ball
        this.ballX += this.delta.dx 
        this.ballY += this.delta.dy
        // Checks if the ball hits the sides of the game screen
        if(this.ballX + this.delta.dx > GW - this.radius || this.ballX + this.delta.dx < this.radius){
            this.delta.dx = -this.delta.dx;
        }
        // Checks to see if the ball hits the top of the game screen
        if(this.ballY + this.delta.dy < this.radius){
            this.delta.dy = -this.delta.dy;
        }
        // Ball & Paddle Collision
        if(this.ballY + this.delta.dy < this.radius || 
            (
            this.ballY + this.delta.dy > GH - paddle.height - this.radius &&
            this.ballX + this.delta.dx > paddle.position.x &&
            this.ballX + this.delta.dx < paddle.position.x + paddle.width
            ) 
        ){
            score++
            this.delta.dy = -this.delta.dy
        }
        else if(this.ballY + this.delta.dy > GH){
            location.reload()
        }
    }
}
// Paddle class
class Paddle {
    constructor(gameWidth, gameHeight) {
        this.width = 150;
        this.height = 20;
        this.position = {
            x: (gameWidth - this.width) / 2,
            y: gameHeight - this.height - 10
        }
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
// Instation
let ball = new Ball()
let paddle = new Paddle(GW, GH);

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
    ctx.fillText(`Speed: ${strBallYDir}`, 100, 15)
}
// The loop
const gameLoop = () => {
    document.addEventListener("keydown", startMovement);
    document.addEventListener("keyup", stopMovement);
    ctx.clearRect(0, 0, GW, GH)
    uiScore(ctx)
    uiSpeed(ctx)
    // changes the ball movement
    ball.update(ctx);
    ball.draw(ctx);
    paddle.draw(ctx);
    paddle.update(leftPressed, rightPressed)
// Calls the loop again
    requestAnimationFrame(gameLoop);
}
setTimeout(gameLoop, 1000 / 60)
// Requests the loop every frame
requestAnimationFrame(gameLoop);