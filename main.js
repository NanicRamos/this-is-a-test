const canvas = document.getElementById('myCanvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = .5

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: "./images/shop.png",
    scale: 2.75,
    max: 6,
    framesBy: 0.3
})

const player = new Fighter({
    position: {
        x: 30,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./images/samuraiMack/Idle.png",
    scale: 2.5,
    max: 8,
    framesBy: 0.3,
    offset:{
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: "./images/samuraiMack/Idle.png",
            max: 8,
            framesBy: 0.2
        },
        run: {
            imageSrc: "./images/samuraiMack/Run.png",
            max: 8,
            framesBy: 0.2
        },
        jump: {
            imageSrc: "./images/samuraiMack/Jump.png",
            max: 2,
            framesBy: 0.1
        },
        fall: {
            imageSrc: "./images/samuraiMack/Fall.png",
            max: 2,
            framesBy: 0.1
        },
        attack1: {
            imageSrc: "./images/samuraiMack/Attack1.png",
            max: 6,
            framesBy: 0.45
        },
        takeHit: {
            imageSrc: "images/samuraiMack/Take Hit - white silhouette.png",
            max: 4,
            framesBy: 0.4
        },
        death: {
            imageSrc: "images/samuraiMack/Death.png",
            max: 6,
            framesBy: 0.4
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 130,
        height: 50
    }
})

const ememy = new Fighter({
    position: {
        x: canvas.width-100,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./images/samuraiMack/Idle.png",
    scale: 2.5,
    max: 8,
    framesBy: 0.3,
    offset:{
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: "./images/kenji/Idle.png",
            max: 4,
            framesBy: 0.2
        },
        run: {
            imageSrc: "./images/kenji/Run.png",
            max: 8,
            framesBy: 0.2
        },
        jump: {
            imageSrc: "./images/kenji/Jump.png",
            max: 2,
            framesBy: 0.1
        },
        fall: {
            imageSrc: "./images/kenji/Fall.png",
            max: 2,
            framesBy: 0.1
        },
        attack1: {
            imageSrc: "./images/kenji/Attack1.png",
            max: 4,
            framesBy: 0.3
        },
        takeHit: {
            imageSrc: "images/kenji/Take hit.png",
            max: 3,
            framesBy: 0.4
        },
        death: {
            imageSrc: "images/kenji/Death.png",
            max: 7,
            framesBy: 0.2
        }
    },
    attackBox: {
        offset: {
            x: -130,
            y: 50,
        },
        width: 120,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    }
}
decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    shop.update();
    player.update();
    if(player.position.x > canvas.width/2){
        player.image.style.transform = "scaleX(-1)";
    }
    ememy.update();

    player.velocity.x = 0;
    ememy.velocity.x = 0;

    //player movement
    player.switchSprite("idle");
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5;

        player.switchSprite("run");
    } 
    else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
        
        player.switchSprite("run");
    }

    if (player.velocity.y < 0){
        player.switchSprite("jump");
    }   else if(player.velocity.y > 0){
            player.switchSprite("fall");
        }
    

    ememy.switchSprite("idle");
    //ememy movement
    //distance fol Math.sqrt(   (   (x2-x1)^2) )
    if(player.position.x > ememy.position.x-ememy.width-500 && player.position.y === ememy.position.y){
        if(player.position.x < ememy.position.x-ememy.width-50){
            ememy.velocity.x = -5;

            ememy.switchSprite("run");
        }
    }
    //if(player.position.x > ememy.position.x-ememy.width-49 && !(player.position.x < ememy.position.x-ememy.width-100)){
    //    ememy.velocity.x = 5;
//
    //    ememy.switchSprite("run");
    //}

    //detect collison for player
    if(dectectCollison(player, ememy) && player.IsAttacking && Math.floor(player.frame) === 4){
        console.log('hit1');
        ememy.takeHit();
        document.getElementById('myEmemyHP').style.width = `${ememy.health}%`
    }

    if(player.IsAttacking && Math.floor(player.frame) === 4){
        player.IsAttacking = false;
    }

    //dectect collison for emeny
    if(dectectCollison(ememy, player) && ememy.IsAttacking && Math.floor(ememy.frame) === 2){
        console.log('hit2');
        player.takeHit();
        document.getElementById('myPlayerHP').style.width = `${player.health}%`
    }

    if(ememy.IsAttacking && Math.floor(ememy.frame) === 2){
        ememy.IsAttacking = false;
    }

    

    //end game based on HP
    if(ememy.health <= 0 || player.health <= 0){
        determineWinner(player, ememy, timerId);
    }
}

animate();

window.addEventListener('keydown', (event) => {
    if(!player.dead){
        switch (event.key){
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd'
            break
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a'
            break
            case 'w':
                player.velocity.y = -15
            break
            case 's':
                player.attack();
            break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = false;
        break

        case 'a':
            keys.a.pressed = false;
        break
    }
})