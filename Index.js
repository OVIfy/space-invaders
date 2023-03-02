let spaceshipImage
let alienImage
let spaceship
let gridSize = 20
let allBullets = []
let alien
let swarm

let game

function preload() {
    spaceshipImage = loadImage('./assets/images/spaceship.png');
    alienImage = loadImage('./assets/images/alien.png');
}

function setup(){
    createCanvas(500, 500);
    // spaceship = new Spaceship(spaceshipImage)
    // alien = new Alien(alienImage)
    // swarm = new Swarm(5, alienImage)

    spaceshipImage.height = gridSize
    spaceshipImage.width = gridSize
    alienImage.height = gridSize
    alienImage.width = gridSize
    game = new Game(3)
}

function draw(){
    background(150);
    // spaceship.setpos(mouseX)
    // spaceship.draw()
    // // alien.draw()

    // swarm.draw()

    // allBullets.forEach(bullet => {
    //     bullet.setdir(0,-10)
    //     bullet.draw()
    // })


    // if(allBullets.length > 1)
    // for(let i = 0; i < allBullets.length; i++){
    //     for(let j = i + 1; j < swarm.aliens.length; j++){

    //         if(dist(allBullets[i].position.x, allBullets[i].position.y, swarm.aliens[j].x, swarm.aliens[j].y) < gridSize)
    //             console.log('hit')
            
    //     }
    // }

    game.draw()

}

function mouseClicked(event) {
    // let bullet = new Bullet(spaceship.position.x + gridSize/2 - 1, spaceship.position.y, 'player', 1)
    // allBullets.push(bullet)

    let bullet = new Bullet(game.spaceship.position.x + gridSize/2 - 1, game.spaceship.position.y, 'player', 0.1)
    bullet.setSpeed(0, -10)
    game.bullets.push(bullet)
}

class Spaceship{
    constructor(img, x = 20, y = height - gridSize*2){
        this.position = createVector(x,y)
        this.img = img
        this.img.height = gridSize
        this.img.width = gridSize
    }

    setpos(x = 0,y = 0){
        if(x > 0)
        this.position.x = x

        if(y > 0)
        this.position.y = y
    }

    draw(){
        image(this.img, constrain(this.position.x, 0, width - this.img.width), this.position.y, 20, 20);
    }
}

class Bullet{
    constructor(x = 0, y = 0, tag, w = gridSize/6, h = gridSize/2){
        this.position = createVector(x,y)
        this.w = w
        this.h = h
        this.tag = tag
        this.speedX = 0
        this.speedY = 0
    }

    update(){
        this.position.x = this.position.x + this.speedX
        this.position.y = this.position.y + this.speedY
    }

    setSpeed(x = 0, y = 0){
        this.speedX = x
        this.speedY = y
    }

    draw(){
        fill('white')
        stroke('white')
        rect(this.position.x, this.position.y, this.w, this.h)
    }

}

class Alien{
    constructor(img, x = 20, y = 50){
        this.position = createVector(x,y)
        this.img = img
        this.columns = Math.floor(width / gridSize)
        this.rows = Math.floor(height / gridSize)
    }

    setpos(x = 0,y = 0){
        if(x > 0)
        this.position.x = x

        if(y > 0)
        this.position.y = y
    }

    draw(){
        image(this.img, this.position.x, this.position.y, 20, 20);
    }
}

class Swarm{
    constructor(numOfRows = 0, img){
        this.columns = width / gridSize
        this.rows = numOfRows
        this.aliens = []
        this.img = img
        this.createAliens(numOfRows)
        this.updateSwarmPos()
    }

    createAliens(numberOfRows){
        let totalNumofAliens = numberOfRows * this.columns - numberOfRows * 2
        for (let i = 0; i < totalNumofAliens; i++) {
            this.aliens.push(new Alien(this.img, -gridSize, -gridSize))
        }
        // console.log(this.aliens.length)
        let alienindx = 0
        let rowRandomizer = 50 * numberOfRows //for randomizing the animation
        let colRandomizer = 20 * this.columns * numberOfRows

        for(let j = 1; j < numberOfRows + 1; j++)
        {    
            
            for (let i = 1; i < this.columns - 1; i++) {
                setTimeout(()=>{
                    this.aliens[alienindx].position.x = i * gridSize 
                    this.aliens[alienindx].position.y = j * gridSize
                    alienindx++
                }, j + rowRandomizer +  colRandomizer)
                colRandomizer -= 20
            }
            rowRandomizer -= 50

        }

    }

    updateSwarmPos(){
       
    }

    draw(){
        this.aliens.forEach(a => a.draw())
    }
}

class Game{
    constructor(numberOfAlienRows){
        this.spaceship = new Spaceship(spaceshipImage)
        this.alien = new Alien(alienImage)
        this.swarm = new Swarm(numberOfAlienRows, alienImage)
        this.bullets = []
    }

    checkAlienHit(){
        for(let i = 0; i < this.swarm.aliens.length; i++){
            for(let j = 0; j < this.bullets.length; j++){
                if(this.bullets.length > 0){
                    // if(dist(this.swarm.aliens[i].position.x, this.swarm.aliens[i].position.y, this.bullets[j].position.x, this.bullets[j].position.y) < gridSize/2)
                    if(this.bullets[j].position.y >= this.swarm.aliens[i].position.y && this.bullets[j].position.y <= this.swarm.aliens[i].position.y + gridSize){
                        if(this.bullets[j].position.x >= this.swarm.aliens[i].position.x && this.bullets[j].position.x <= this.swarm.aliens[i].position.x + gridSize){
                            console.log('hit')
                            this.swarm.aliens.splice(i,1)
                            this.bullets.splice(j,1)
                            break;
                        }
                    }
                }
            // console.log(this.swarm.aliens[i].position.x, this.swarm.aliens[i].position.y, this.bullets[0].position.x, this.bullets[0].position.y)
            }
        }
    }

    async optimize(){
        this.bullets.forEach((bullet, i) => {
            if(bullet.position.y < gridSize)
                this.bullets.splice(i,1)
        })
    }

    draw(){
        this.spaceship.setpos(mouseX)
        this.spaceship.draw()
        // alien.draw()
    
        this.swarm.draw()
    
        this.bullets.forEach(bullet => {
            bullet.update()
            bullet.draw()
        })

        this.checkAlienHit()
        this.optimize()
    }
}



// if(this.#distanceFromEdge != 0){
//     if(this.#goingRight == true){
//         for(const alien of this.aliens){
//             tForEach = (width - gridSize * 2) - alien.position.x 
//             if(tForEach < this.#distanceFromEdge)
//                 this.#distanceFromEdge = tForEach
//         }

//         for(const alien of this.aliens)
//             alien.addpos(gridSize, 'none')
//     }
    
//     if(this.#goingRight == false){
//         for(const alien of this.aliens){
//             tForEach = alien.position.x - (0 + gridSize)
//             if(tForEach < this.#distanceFromEdge)
//                 this.#distanceFromEdge = tForEach
//         }

//         for(const alien of this.aliens)
//             alien.addpos(-gridSize, 'none')
//         console.log('kolo')
//     }
    
//         // console.log(times)

// }else{
//     console.log('here')
//     this.#distanceFromEdge = Infinity
//     this.#goingRight = !this.#goingRight

//     console.log(this.#goingRight)
// }