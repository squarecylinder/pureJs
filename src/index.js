let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");


//Canvas width and height
const GW = 800;
const GH = 600;
let rightPressed = false;
let leftPressed = false;

// Ball class
class Ball {
    // Size of the ball and how it
    constructor(){
        this.ballX = GW / 2;
        this.ballY = GH - 50;
        this.radius = 10;
        this.delta = {
            dx: 2,
            dy: -2
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
        // Deletes the last position of the ball off the game screen
        ctx.clearRect(0, 0, GW, GH);
        // Checks if the ball hits the sides of the game screen
        if(this.ballX + this.delta.dx > GW - this.radius || this.ballX + this.delta.dx < this.radius){
            this.delta.dx = -this.delta.dx;
        }
        // Checks to see if the ball hits the top of the game screen
        if(this.ballY + this.delta.dy < this.radius){
            this.delta.dy = -this.delta.dy;
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
        ctx.fillStyle = '#7fcab4';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    // Updates left or right based on input
    update(lp, rp){
    ctx.clearRect(0, 0, 800, 600)
    if(rp && (this.position.x + this.width) < GW ){
        console.log(rp);
        this.position.x += 20;
        rp = false
        console.log(rp)
        }
    if(lp && this.position.x > 0){
        this.position.x += -20;
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
        leftPressed = true;
        paddle.update(leftPressed, false)
        }
    if(e.code === 'KeyD' || e.code === 'ArrowRight'){
        rightPressed = true
        paddle.update(false, rightPressed)
        }
    }

    const stopMovement = (e) => {
    if(e.code === 'KeyA' || e.code === 'ArrowLeft'){
        console.log('test')
        leftPressed = false
        paddle.update(leftPressed, false)
        }
    if(e.code === 'KeyD' || e.code === 'ArrowRight'){
        rightPressed = false
        paddle.update(false, rightPressed)
        }
}

// The loop
const gameLoop = () => { 
    document.addEventListener("keydown", startMovement);
    document.addEventListener("keyup", stopMovement);
    // changes the ball movement
    ball.update(ctx);
    ball.draw(ctx);
    paddle.draw(ctx);

    requestAnimationFrame(gameLoop);
}

// Requests the loop every frame
requestAnimationFrame(gameLoop);