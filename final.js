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
        text('click to start',width/2 - 60,height/2 + gridSize)

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
        text('click to restart',width/2 - 50,height/2 + gridSize)
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
            spaceship.moveTo(constrain(mouse.x, 0 + spaceship.hw, width - spaceship.hw), height - spaceship.hh, 20)  
        }

        if(this.#gamestate == 'game-over')
        this.gameOver()

    }
}

function setup(){
    if (windowWidth > 700){
        createCanvas(700,500)
        gridSize = 30
    }
    else
    createCanvas(windowWidth - 18,500)
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
    
}

function mousePressed(event){
    console.log('pressed')

    if(game.gameState == 'pre-start'){
        game.gameState = 'start'
        setTimeout(()=>{
            gameplayMusic.play()
        },1000)
        gameplayMusic.onended = () => gameplayMusic.play()
        return
    }

    if(game.gameState == 'game'){
        let newBullet = new Sprite(spaceship.x, spaceship.y, 1, 5)
        newBullet.stroke = '#90EE90'
        newBullet.move(1000, 'up', 20)
        playerBullets.add(newBullet)
        spaceship.moveTo(constrain(mouse.x, 0 + spaceship.hw, width - spaceship.hw), height - spaceship.hh, 20)  
    }

    if(game.gameState == 'start')
    game.gameState = 'loading'

   if(game.gameState == 'game-over')
        game.gameState = 'pre-start'
}

