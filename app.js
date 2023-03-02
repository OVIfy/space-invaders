let spaceshipImage
let alienImage
let gridSize = 20
let game

function preload() {
    spaceshipImage = loadImage('./assets/images/spaceship.png');
    alienImage = loadImage('./assets/images/alien.png');
}

function setup(){
    createCanvas(500, 500);
    spaceshipImage.height = gridSize
    spaceshipImage.width = gridSize
    alienImage.height = gridSize
    alienImage.width = gridSize
    game = new Game(3)
    game.start()
}

function draw(){
    background(150);
    game.draw()
}

function mouseClicked(event) {
    let bullet = new Bullet(game.spaceship.position.x + gridSize/2 - 1, game.spaceship.position.y, 'player', 0.1)
    game.spaceship.bullets.push(bullet)
}

class GameObject{
    constructor(x, y, img = 'none', tag = 'none'){
        this.position = createVector(x,y)
        this.img = img
        this.tag = tag
    }

    setpos(x = 0,y = 0){
        if(x > 0)
        this.position.x = x

        if(y > 0)
        this.position.y = y
    }

    addpos(x = 'none',y = 'none'){
        if(x != 'none')
        this.position.x += x

        if(y != 'none')
        this.position.y += y
    }

    checkIntersection(gameObject){
            if(gameObject.position.y >= this.position.y && gameObject.position.y <= this.position.y + gridSize){
                if(gameObject.position.x >= this.position.x && gameObject.position.x <= this.position.x + gridSize){
                    return true
                }
            }
        return false
    }
}


class Spaceship extends GameObject{
    constructor(x = 20, y = height - gridSize*2, img){
       super(x, y, img)
       this.bullets = []
    }

    draw(){
        this.bullets.forEach(bullet => {
            bullet.addpos(0, -10)
            bullet.draw()
        })

        image(this.img, constrain(this.position.x, 0, width - this.img.width), this.position.y, 20, 20);

        this.bullets.forEach((bullet, i) => {
            if(bullet.position.y < gridSize * 2)
                this.bullets.splice(i,1)
        })
    }
}

class Bullet extends GameObject{
    constructor(x = 0, y = 0, tag, w = gridSize/6, h = gridSize/2, img){
        super(x, y,img ,tag)
            this.w = w
            this.h = h
    }

    draw(){
        fill('white')
        stroke('white')
        rect(this.position.x, this.position.y, this.w, this.h)
    }

}

class Alien extends GameObject{
    constructor(x = 20, y = 50, img, tag){
        super(x, y, img, tag)
    }

    draw(){
        image(this.img, this.position.x, this.position.y, 20, 20);
    }
}

class Swarm{
    #status = 'at center'
    #goingRight = true
    constructor(numOfRows = 0, img){
        this.columns = width / gridSize
        this.rows = numOfRows // nu
        this.aliens = []
        this.img = img
        this.bullets = []
        this.createAliens(numOfRows)
    }

    createAliens(numberOfRows){
        let totalNumofAliens = numberOfRows * this.columns - numberOfRows * 2
        let alienindx = 0
        for (let i = 0; i < totalNumofAliens; i++) {
            this.aliens.push(new Alien(-gridSize, -gridSize, this.img))
        }

        for(let j = 1; j < numberOfRows + 1; j++)
        {    
            for (let i = 1; i < this.columns - 1; i++) {
              
                this.aliens[alienindx].setpos(i * gridSize, j * gridSize)
                alienindx++
            }
        }
    }

    move(){

        if(this.#goingRight && this.#status != 'hit end'){
            this.aliens.forEach(a => a.addpos(gridSize)) 
            this.#status = 'right'
        }

        if(!this.#goingRight && this.#status != 'hit end'){
            this.aliens.forEach(a => a.addpos(-gridSize)) 
            this.#status = 'left'
        }

        if(this.#status == 'hit end'){
            this.aliens.forEach(a => a.addpos('none', gridSize)) 
            this.#goingRight = !this.#goingRight
            this.#status = 'leave'
            return
        }
        
        for(const alien of this.aliens){
            if(alien.position.x == width - gridSize || alien.position.x == 0) //when any of the aliens hit the right edge of the canvas
            { 
                this.#status = 'hit end'
            }
        }
    }

    shoot(target){
        for(let i = this.aliens.length - 1; i >= 0; i--){
            if(this.aliens[i].position.x >= target.position.x && this.aliens[i].position.x + gridSize <= target.position.x + gridSize * 2)
                if(!this.bullets.some(e => e.tag == 'at player')){
                    this.bullets.push(new Bullet(this.aliens[i].position.x + gridSize/2 - 1, this.aliens[i].position.y, 'at player', 0.1))
                    if(this.aliens[i + 1])
                    this.bullets.push(new Bullet(this.aliens[i + 1].position.x + gridSize/2 - 1, this.aliens[i + 1].position.y, 'player-left', 0.1))

                    if(this.aliens[i -1])
                    this.bullets.push(new Bullet(this.aliens[i - 1].position.x + gridSize/2 - 1, this.aliens[i].position.y, 'player-right', 0.1))

                }

        }
     

    }

    checkAlienHit(objects){
        for(const [ali, alien] of this.aliens.entries()){
            for(const [bi, bullet] of objects.entries()){
                if(alien.checkIntersection(bullet)){
                    this.aliens.splice(ali,1)
                    objects.splice(bi,1)
                    break;
                }
            }
        }
    }

    draw(){

        this.bullets.forEach(bullet => {
            if(bullet.tag == 'at player')
            bullet.addpos(0, 6)

            if(bullet.tag == 'player-left')
            bullet.addpos(0, 4)

            if(bullet.tag == 'player-right')
            bullet.addpos(0, 3)

            bullet.draw()
        })

        this.aliens.forEach(a => a.draw())

        this.bullets.forEach((bullet, i) => {
            if(bullet.position.y > height - gridSize * 2)
                this.bullets.splice(i,1)
        })
    }
}



class Game{
    constructor(numberOfAlienRows){
        this.spaceship = new Spaceship(0, height - gridSize * 2,spaceshipImage)
        this.alien = new Alien(alienImage)
        this.swarm = new Swarm(numberOfAlienRows, alienImage)
        this.bullets = []
        this.gameState = 'start'
        
    }

    start(){

        setTimeout(()=>{
            this.gameState = 'started'
            // this.swarm.aliens.forEach(a => a.addpos(gridSize))
            
        }, 3000)
        setInterval(()=>{
            this.swarm.move()
        }, 2000)
   
    }

    draw(){
        this.spaceship.setpos(mouseX)
        this.spaceship.draw()
    
        this.swarm.draw()

        this.swarm.checkAlienHit(this.spaceship.bullets)
        this.swarm.shoot(this.spaceship)
      
    }
}
