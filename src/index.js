let ctx = document.getElementById("gameScreen").getContext('2d')
//Canvas width and height
const GW = 960;
const GH = 540;
// state of key press
let rightPressed = false;
let leftPressed = false;
let score = 0;
// Defines the angle of the balls starting pos
// Ball class
class Ball {
    constructor(){
        // where the ball spawns on the screen
        this.ballX = GW / 2;
        this.ballY = GH - 100;
        // size of the ball
        this.radius = 8;
        // angle and speed at which the ball moves once spawned
        this.direction = Math.random() * Math.PI * 2;
        this.speed = Math.ceil(Math.random() * 5);
    
        this.hitbox = true;
    }
    // How we draw a ball shape
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    update(ctx){
        if(this.hitbox){
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.arc(this.ballX+1, this.ballY+1, this.radius, 0, 2 * Math.PI, false)
            ctx.stroke()
        }
        // Changes direction of ball
        this.ballX += Math.cos(this.direction)  * this.speed
        this.ballY += Math.sin(this.direction) * this.speed
        if(this.ballX - this.radius < 0){
            // this.ballX = this.radius;
            this.direction = Math.atan2(Math.sin(this.direction), -Math.cos(this.direction))
        }
        if(this.ballX + this.radius > GW){
            // this.ballX = GW - this.radius;
            this.direction = Math.atan2(Math.sin(this.direction), -Math.cos(this.direction))
        }
        if(this.ballY - this.radius < 0){
            // this.ballY = this.radius;
            this.direction = Math.atan2(-Math.sin(this.direction), Math.cos(this.direction))
        }
        // Ball & Paddle Collision
        if(this.ballY == paddle.position.y || (this.ballY > GH - paddle.height - this.radius && this.ballX > paddle.position.x && this.ballX < paddle.position.x + paddle.width)){
            // every time the ball hits the paddle, we iterate up the score
            this.direction = Math.atan2(-Math.sin(this.direction), Math.cos(this.direction));
            // If we touch the bottom of the screen, reload page.
        }
        else if(this.ballY + this.direction > GH){
            location.reload()
        }
        // Ball & Brick collision
        for(let i = 0 ; i < bricks.length; i++){
            if(this.ballY > bricks[i].position.y && this.ballY < bricks[i].position.y + bricks[i].height && this.ballX > bricks[i].position.x && this.ballX < bricks[i].position.x + bricks[i].width){
                bricks[i].break(ctx);
                score++
                this.direction = Math.atan2(-Math.sin(this.direction), Math.cos(this.direction));
                bricks.splice(i, 1);
            }
        }
        if(!bricks.length){
            alert("THIS IS BAD PRACTICE")
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
        this.destroyed = false
    }
    break(ctx){
        ctx.clearRect(this.width, this.height, this.position.x, this.position.y)
        this.destroyed = true
    }
}
// Instation
let bricks = [];
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
for (let i = 0; i < 5; i++){
    let brick = new Brick(i,2)
    bricks.push(brick)
}
// The loop
const gameLoop = () => {
    ctx.clearRect(0, 0, GW, GH);
    uiScore(ctx);
    uiSpeed(ctx);
    for(let i = 0; i < bricks.length; i++){
        if(!bricks[i].destroyed){
        ctx.beginPath();
        ctx.rect(bricks[i].position.x, bricks[i].position.y, bricks[i].width, bricks[i].height)
        ctx.fillStyle = '#7fcab4';
        ctx.fill()
        ctx.closePath()}
    }
    // changes the ball movement
    ball.update(ctx);
    ball.draw(ctx);
    //draws the ball
    paddle.draw(ctx);
    paddle.update(leftPressed, rightPressed);
    // Calls the loop again
    requestAnimationFrame(gameLoop);
}
// Event handlers outside of the loop to stop performance bogs
document.addEventListener("keydown", startMovement);
document.addEventListener("keyup", stopMovement);
// setTimeout(gameLoop, 1000 / 60)
// Requests the loop every frame
requestAnimationFrame(gameLoop);