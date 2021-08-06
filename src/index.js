let ctx1 = document.getElementById("gameScreen").getContext('2d')
//Canvas width and height
const GW1 = canvas.width;
const GH1 = canvas.height;
// state of key press
let rightPressed = false;
let leftPressed = false;
let score = 0;
let killGame = false;
// Defines the angle of the balls starting pos
// Ball class
class Ball {
    constructor(){
        // where the ball spawns on the screen
        this.ballX = GW1 / 2;
        this.ballY = GH1 - 100;
        // size of the ball
        this.radius = 8;
        // angle and speed at which the ball moves once spawned
        this.direction = Math.random() * -(Math.PI);
        this.speed = Math.ceil(Math.random() * 5);
    
        this.hitbox = false;
    }
    // How we draw a ball shape
    draw(ctx1){
        ctx1.beginPath();
        ctx1.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2)
        ctx1.fillStyle = 'red';
        ctx1.fill();
        ctx1.closePath();
    }
    update(ctx1){
        if(this.hitbox){
            ctx1.strokeStyle = "blue";
            ctx1.beginPath();
            ctx1.arc(this.ballX+1, this.ballY+1, this.radius, 0, 2 * Math.PI, false)
            ctx1.stroke()
        }
        // Changes direction of ball
        this.ballX += Math.cos(this.direction)  * this.speed
        this.ballY += Math.sin(this.direction) * this.speed
        if(this.ballX - this.radius < 0){
            // this.ballX = this.radius;
            this.direction = Math.atan2(Math.sin(this.direction), -Math.cos(this.direction))
        }
        if(this.ballX + this.radius > GW1){
            // this.ballX = GW1 - this.radius;
            this.direction = Math.atan2(Math.sin(this.direction), -Math.cos(this.direction))
        }
        if(this.ballY - this.radius < 0){
            // this.ballY = this.radius;
            this.direction = Math.atan2(-Math.sin(this.direction), Math.cos(this.direction))
        }
        // Ball & Paddle Collision
        if((this.ballY > GH1 - paddle.height - this.radius && this.ballX > paddle.position.x && this.ballX < paddle.position.x + paddle.width)){
            let difference = Math.floor(this.ballX) - paddle.position.x
            let percentage = (difference / paddle.width).toFixed(2)
            switch(true){
                case percentage <= .45:
                    this.direction = Math.atan2(-Math.sin(this.direction), -Math.cos(percentage  * (180/Math.PI)))
                    console.log('left hit');
                    break;
                case percentage >= .65:
                    this.direction = Math.atan2(-Math.sin(this.direction), Math.cos(percentage  * (180/Math.PI)))
                    console.log('right hit');
                    break;
                default:
                    this.direction = Math.atan(-Math.sin(this.direction), Math.cos(this.direction))
                    console.log('middle hit')
                    break;
            }
            // this.direction = Math.atan2(-Math.sin(this.direction), Math.cos(this.direction));
        }
        // If we touch the bottom of the screen, reload page.
        else if(this.ballY + this.direction > GH1){
            location.reload()
        }
        // Ball & Brick collision
        for(let i = 0 ; i < bricks.length; i++){
            if(this.ballY > bricks[i].position.y && this.ballY < bricks[i].position.y + bricks[i].height && this.ballX > bricks[i].position.x && this.ballX < bricks[i].position.x + bricks[i].width){
                bricks[i].break(ctx1);
                bricks.splice(i, 1);
                this.direction = Math.atan2(-Math.sin(this.direction), Math.cos(this.direction));
                score++
            }
        }
        if(!bricks.length){
            this.speed = 0;
            uiWin()
        }
    }
}
// Paddle class
class Paddle {
    constructor() {
        this.width = 150;
        this.height = 20;
        this.position = {
            x: (GW1 - this.width) / 2,
            y: GH1 - this.height - 10
        }
        this.hitbox = false;
    }
    // Drawing a paddle
    draw(ctx1){
        ctx1.beginPath();
        ctx1.rect(this.position.x, this.position.y, this.width, this.height)
        ctx1.fillStyle = '#7fcab4';
        ctx1.fill()
        ctx1.closePath()
    }
    // Updates left or right based on input
    update(lp, rp){
        if(this.hitbox){
            ctx1.beginPath();
            ctx1.strokeStyle = 'black';
            ctx1.rect(this.position.x, this.position.y - 10, 0, 20);
            ctx1.stroke()
            ctx1.beginPath();
            ctx1.strokeStyle = 'red';
            ctx1.rect(this.position.x + 66, this.position.y, 20, this.height);
            ctx1.stroke()
            ctx1.beginPath();
            ctx1.strokeStyle = 'black';
            ctx1.rect(this.position.x + this.width, this.position.y - 10, 0, this.height);
            ctx1.stroke()
        }
    if(rp && (this.position.x + this.width) < GW1 ){
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
        this.width = GW1 / 10;
        this.height = 30;
        this.position = {
            x: 100 + (posX * 150 - (this.width / 10)),
            y: 125 + (posY * 50)
        }
        this.destroyed = false
    }
    break(ctx1){
        ctx1.clearRect(this.width, this.height, this.position.x, this.position.y)
        this.destroyed = true
    }
}
// Instation
let bricks = [];
// pushes new bricks in different spots into bricks[]
for (let i = 0; i < 17; i++){
    let brick = new Brick(i,0)
    bricks.push(brick)
    if(i > 5){
        let brick = new Brick(i - 6, 1)
        bricks.push(brick)
    }
    if(i > 10){
        let brick = new Brick(i - 11, 2)
        bricks.push(brick)
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
const touchHandler = (e) => {
    if(e.touches[0].pageX < GW1 / 2){
        e.preventDefault()
        leftPressed = true;
        console.log(e.touches[0])
    }
    if(e.touches[0].pageX > GW1 / 2){
        e.preventDefault()
        rightPressed = true
        console.log(e.touches[0])
    }
}
const touchHandleStop = (e) => {
        leftPressed = false;
    
        rightPressed = false
}
// UI Elements
const uiScore = () => {
    ctx1.font = '18px sans-serif';
    ctx1.fillText(`Score: ${score}`, 0, 15);
}
const uiSpeed = () => {
    ctx1.font = '18px serif';
    ctx1.fillText(`Speed: ${ball.speed}`, 100, 15)
}
const uiWin = () => {
    ctx1.font = '48px sans-serif';
    ctx1.fillText('You won!', GW1 / 2, GH1 / 2)
}
// toggle hitboxes on click
const uiDev = () => {
    console.log('Dev mode Changed!')
    paddle.hitbox = !paddle.hitbox;
    ball.hitbox = !ball.hitbox;
}
// The loop
const gameLoop = () => {
    ctx1.clearRect(0, 0, GW1, GH1);
    uiScore();
    uiSpeed();
    for(let i = 0; i < bricks.length; i++){
        if(!bricks[i].destroyed){
        ctx1.beginPath();
        ctx1.rect(bricks[i].position.x, bricks[i].position.y, bricks[i].width, bricks[i].height)
        ctx1.fillStyle = '#7fcab4';
        ctx1.fill()
        ctx1.closePath()}
    }
    // changes the ball movement
    ball.update(ctx1);
    ball.draw(ctx1);
    //draws the ball
    paddle.draw(ctx1);
    paddle.update(leftPressed, rightPressed);
    // Calls the loop again
    if(!killGame){
        requestAnimationFrame(gameLoop);
    }
}
// Event handlers outside of the loop to stop performance bogs
document.addEventListener("keydown", startMovement);
document.addEventListener("keyup", stopMovement);
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);
document.addEventListener("touchend", touchHandleStop);
// document.addEventListener("click", uiDev);
// setTimeout(gameLoop, 1000 / 60)
// Requests the loop every frame
// requestAnimationFrame(gameLoop);