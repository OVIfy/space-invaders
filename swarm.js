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
                hist = 'two'
                await this.aliens.move(20, 'down', 10)
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
                hist = 'one'
                await this.aliens.move(20, 'down', 10)
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