let spaceshipImage
let spaceship
let gridSize = 20
let playerBullet

function preload() {
    spaceshipImage = loadImage('./assets/images/spaceship.png');
}

function setup(){
    createCanvas(500, 500);
    spaceship = new Spaceship(spaceshipImage)
    playerBullet = new Bullet()
    console.log('X',mouseX)
}

function draw(){
    background(220);
    spaceship.setpos(mouseX)
    spaceship.draw()

    playerBullet.draw()
}

class Spaceship{
    constructor(img, x = 20, y = height){
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
        console.log(this.img.height)
        image(this.img, constrain(this.position.x, 0, width - this.img.width),height - this.img.height*2, 20, 20);
    }
}

class Bullet{
    constructor(x = 0, y = 0, w = gridSize/6, h = gridSize/2, tag){
        this.position = createVector(x,y)
        this.w = w
        this.h = h
        this.tag = tag
        
    }

    setdir(dirX = 0, dirY = 0){
        this.position.x = this.position.x + dirX
        this.position.y = this.position.y + dirY
    }

    draw(){
        fill('red')
        rect(this.position.x, this.position.y, this.w, this.h)
    }

}

