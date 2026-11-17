class Sprite {
    constructor({ position, imageSrc, scale = 1, max = 1, frame = 0, framesBy = 0, offset = {x:0, y:0}}) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = max;
        this.frame = frame;
        this.framesBy = framesBy;
        this.offset = offset;
    }

    draw() {
        c.drawImage(
            this.image,
            Math.floor(this.frame) * (this.image.width / this.framesMax),
            0,
            (this.image.width / this.framesMax),
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
    }

    update() {
        this.draw();
        this.nextframe();
    }

    nextframe() {
        this.frame+=this.framesBy;
        this.frame %= this.framesMax;
    }
}

class Fighter extends Sprite{
    constructor({ 
        position, 
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        max = 1, 
        frame = 0, 
        framesBy = 0,
        offset = {x:0, y:0},
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined, 
        }
    }) {
        super({
            position,
            imageSrc,
            scale,
            frame,
            framesBy,
            max,
            offset
        });

        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position:{
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color;
        this.IsAttacking = false;
        this.health = 100
        this.sprites = sprites;
        this.dead = false;
        
        for(const sprite in this.sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        if(this.dead === false){
            this.nextframe();
        }
        this.draw();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height-96){
            this.velocity.y = 0;
            this.position.y = 330;
        }

        else{
            this.velocity.y += gravity
        }
    }

    attack() {
        this.switchSprite("attack1")
        this.IsAttacking = true;
    }

    takeHit() {
        this.health-=10;

        if(this.health <= 0){
            this.switchSprite('death')
        } else{
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite) {
        if(this.image === this.sprites.death.image) {
            if(this.frame > this.framesMax - 1){
                this.dead = true;
            }
            return
        };
        if(this.image === this.sprites.attack1.image && this.frame < this.framesMax-1) return;
        if(this.image === this.sprites.takeHit.image && this.frame < this.framesMax-1) return;
        
        switch (sprite) {
            case "idle":
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.framesBy = this.sprites.idle.framesBy;
                    this.framesMax = this.sprites.idle.max;
                }
            break;

            case "run":
                this.image = this.sprites.run.image;
                this.framesBy = this.sprites.run.framesBy;
                this.framesMax = this.sprites.run.max;
            break;

            case "jump":
                this.image = this.sprites.jump.image;
                this.framesBy = this.sprites.jump.framesBy;
                this.framesMax = this.sprites.jump.max;
            break;

            case "fall":
                this.image = this.sprites.fall.image;
                this.framesBy = this.sprites.fall.framesBy;
                this.framesMax = this.sprites.fall.max;
            break;

            case "attack1":
                this.image = this.sprites.attack1.image;
                this.framesBy = this.sprites.attack1.framesBy;
                this.framesMax = this.sprites.attack1.max;
                this.frame = 0;
            break;

            case "takeHit":
                this.image = this.sprites.takeHit.image;
                this.framesBy = this.sprites.takeHit.framesBy;
                this.framesMax = this.sprites.takeHit.max;
                this.frame = 0;
            break;
            
            case "death":
                this.image = this.sprites.death.image;
                this.framesBy = this.sprites.death.framesBy;
                this.framesMax = this.sprites.death.max;
                this.frame = 0;
            break;
        }
    }
}