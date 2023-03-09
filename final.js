let spaceshipImage
let alienBlueImage
let alienGreenImage
let alienMushImage
let alienMush2Image

let arcadeFont
let bloodyFont
let gridSize = 20
let game
let gameplayMusic
let gameOverMusic


let spaceship;

let bullet

let aliens, alienImgs

let playerBullets, enemyBullets

let swarm, blocks

let hist = 'start'

function preload() {
    //loading in assets
    spaceshipImage = loadImage('./assets/images/spaceship.png');
    alienBlueImage = loadImage('./assets/images/alienBlue.png');
    alienGreenImage = loadImage('./assets/images/alienGreen.png');
    alienMushImage = loadImage('./assets/images/mushAlien.png');
    alienMush2Image = loadImage('./assets/images/MushAlien2.png');
    alienIm = loadImage('./assets/images/alien.png');


    alienImgs = [alienBlueImage, alienGreenImage, alienMushImage, alienMush2Image, alienIm]

    arcadeFont = loadFont('./assets/font/Minecraft.ttf')
    bloodyFont = loadFont('./assets/font/BLOODY.TTF')

    gameplayMusic = new Audio('./assets/sounds/the_hammer_man.mp3')
    gameOverMusic = new Audio('./assets/sounds/game-over.wav')
}

class Swarm{
    #cycle = 0
    constructor(){
        this.aliens = new Group()
        this.createAliens()
    }

    createAliens(){
        for(let i = 0; i < 5; i++){ 
            for(let j =0; j < Math.floor(width/gridSize) - 2; j++){
                let mySprite = createSprite(j * gridSize + gridSize/2, (i * gridSize) + gridSize/2, gridSize, gridSize);
                mySprite.img = alienImgs[i]
                mySprite.img.height = gridSize
                mySprite.img.width = gridSize
                mySprite.collider = 'k'
                this.aliens.add(mySprite)
            }
        }
    }

    async moveAliens(){
        let shortestDistanceFromRight = Infinity
        let shortestDistanceFromLeft = Infinity
           
            for(const alien of this.aliens){
                if (alien.visible == true && (width - gridSize/2)  - alien.x < shortestDistanceFromRight){
                    shortestDistanceFromRight = (width - gridSize/2) - alien.x
                }
            }
    
            if(hist == 'start' || hist == 'one'){
                hist = 'one'
                await this.aliens.move(shortestDistanceFromRight, 'right', 0.2)
                await this.aliens.move(20, 'down', 0.2)
                hist = 'start'
            }
    
            for(const alien of this.aliens){
                if (alien.visible == true && alien.x - gridSize/2 < shortestDistanceFromLeft){
                    shortestDistanceFromLeft = alien.x - gridSize/2
                }
            }
    
            if(hist == 'start' || hist == 'two'){
                hist = 'two'
                await this.aliens.move(shortestDistanceFromLeft, 'left', 0.2)
    
                await this.aliens.move(20, 'down', 0.2)
                hist = 'start'
            }
            this.moveAliens()
    }

    

    async shootShip(text){
        for(let i = this.aliens.length - 1; i >= 0; i--){
            // console.log(i
            if(this.aliens[i].x - gridSize/2 <= spaceship.x && this.aliens[i].x + gridSize/2 >= spaceship.x)
            {
                if(text != 'single'){
                    let newBullet = new Sprite(this.aliens[i].x, this.aliens[i].y + gridSize/2, 1, 5)
                    newBullet.stroke = 'white'
                    newBullet.velocity.y = 4
                    enemyBullets.add(newBullet)
                    
                    if(this.aliens[i+1]){
                        let newBullet1 = new Sprite(this.aliens[i+1].x, this.aliens[i+1].y + gridSize/2, 1, 5)
                        newBullet1.stroke = 'white'
                        newBullet1.velocity.y = 4
                        enemyBullets.add(newBullet1)
                    }
                    if(this.aliens[i-1]){
                        let newBullet2 = new Sprite(this.aliens[i-1].x, this.aliens[i-1].y + gridSize/2, 1, 5)
                        newBullet2.stroke = 'white'
                        newBullet2.velocity.y = 3
                        enemyBullets.add(newBullet2)
                    }
                }else{
                    let randomSpeed = Math.random() * 8
                    let newBullet = new Sprite(this.aliens[i].x, this.aliens[i].y + gridSize/2, 1, 5)
                    newBullet.stroke = 'white'
                    newBullet.velocity.y = constrain(randomSpeed, 2, 6)
                    enemyBullets.add(newBullet)
                }
                break;
            }
        }
    
    
    }
}


class Game{
    #gamestate = 'pre-start'
    constructor(){
        this.time = 100
    }

    get gameState(){
        return this.#gamestate
    }

    set gameState(gamestate){
        if(gamestate != this.#gamestate){
                
            this.#gamestate = gamestate
            if(this.#gamestate == 'game')
                this.gameStart()

            if(this.#gamestate == 'loading')
                this.loading()
        }
    }

    gameStart(){
        //initialize and draw all objects for the game when this method is called
        //spaceship
        spaceship = new Sprite(width/2,height + gridSize,gridSize,gridSize, 'k');
        spaceship.img = './assets/images/spaceship.png'
        spaceship.img.width = gridSize
        spaceship.img.height = gridSize

        //bullets sprite group
        playerBullets = new Group()
        enemyBullets = new Group()
        
        //aliens
        swarm = new Swarm()

        // block = new Blocks()
         playerBullets.collided(swarm.aliens, (bullet, alien) => {
            bullet.remove()
            alien.remove()
            swarm.moveAliens()
        })

        spaceship.collides(enemyBullets, (ship, bullet) => {
            bullet.remove()
            swarm.aliens.remove()
            spaceship.remove()
            gameplayMusic.pause()
            gameplayMusic.currentTime = 0
            gameOverMusic.play()
            this.#gamestate = 'game-over'
        })
        swarm.aliens.collides(enemyBullets, (alien, bullet) => {
            if(bullet.y < alien.y)
            bullet.remove()
        })

        enemyBullets.collides(playerBullets, (e, p)=>{
            e.remove()
            p.remove()
        })

        swarm.moveAliens()

        setInterval(()=>{
            swarm.shootShip('single')
        }, 1000)
    }

    preStart(){
        background(150);
        fill('white')
        textSize(30);
        textFont('Impact')
        textStyle(ITALIC)
        if(this.time % 500 == 0)
            fill(225,225,225,225)
        text('Click to start', width/2 - 90,height/2)
    }

    start(){
        background(150);
        textFont(arcadeFont) 
        fill('white')
        push()
        if(this.time % 2000 == 0 || this.time % 2000 <= 800)
            translate(0,-10)
        textSize(30);
        fill('green')
        text('SPACE INVADERS',width/2 - 130,height/2)
        pop()
        if(this.time % 500 == 0)
            fill(225,225,225,225)
        textSize(13);
        text('press any key to start',width/2 - 60,height/2 + gridSize)

    }

    loading(){
        let bg = 150

        let intervalID = setInterval(()=>{
            bg--
            background(bg)
            if(bg === 0){
                
                clearInterval(intervalID)
                this.#gamestate = 'game'
                this.gameStart()
            }
        },1)
    }

    gameOver(){
        background(150)
        fill('red')
        textSize(30);
        textFont(bloodyFont);
        text('Game Over',width/2 - 90,height/2)
        fill('white')
        textSize(7);
        textFont(arcadeFont);
        text('press any key to restart',width/2 - 50,height/2 + gridSize)
    }

    draw(){
        if(millis() >= this.time) //custom timer
        {
           this.time += 100
        }

        if(this.#gamestate == 'pre-start')
        this.preStart()

        if(this.#gamestate == 'start')
        this.start()

        if(this.#gamestate == 'game'){
            background(0)
            spaceship.moveTo(constrain(mouse.x, 0 + spaceship.hw, width - spaceship.hw), height - spaceship.hh, 10)  
        }

        if(this.#gamestate == 'game-over')
        this.gameOver()

    }
}

function setup(){
    ctx = createCanvas(300,500)
    game = new Game()
}

function draw(){
    clear()
    // background(150)
    game.draw() 
}

function mouseReleased(){
    if(game.gameState == 'game')
    swarm.shootShip('single')
}

function mouseClicked(event) {
    //creating new bullets on user click
    if(game.gameState == 'pre-start'){
        game.gameState = 'start'
        gameplayMusic.play()
        gameplayMusic.onended = () => gameplayMusic.play()
    }

    if(game.gameState == 'game'){
        let newBullet = new Sprite(spaceship.x, spaceship.y, 1, 5)
        newBullet.stroke = '#90EE90'
        newBullet.velocity.y = -10
        playerBullets.add(newBullet)
    }
}

function keyPressed(){
   if(game.gameState == 'start')
    game.gameState = 'loading'

   if(game.gameState == 'game-over')
    game.gameState = 'pre-start'

}