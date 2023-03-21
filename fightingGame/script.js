import { Field, Sprite, Fighter } from "./js/classes.js";
import { rectangularCollision, determineWinnder, timer, timerId, decreaseTimer } from "./js/utils.js"
import { P2D, TilesetEditor } from "./js/myCC.js";
import { ground as G } from "./js/assets.js";
import { calculator } from "./js/fps.js"

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const scale = 24;

const field = new Field({
    width: canvas.width,
    height: canvas.height-scale*4,
    gravity: 0.7
});

const layer1 = new Sprite({
    position: new P2D(),
    imageSrc: "./img/background/layer_1.png",
    scale: 3.2
})

const layer2 = new Sprite({
    position: new P2D(),
    imageSrc: "./img/background/layer_2.png",
    scale: 3.2
})

const layer3 = new Sprite({
    position: new P2D(),
    imageSrc: "./img/background/layer_3.png",
    scale: 3.2
})

const ground = new Sprite({
    position: new P2D(0, canvas.height-scale*4),
    imageSrc: G.canvas
})

const shop = new Sprite({
    position: new P2D(600, 128),
    imageSrc: "./img/assets/shop_anim.png",
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: new P2D(),
    velocity: new P2D(),
    offset: new P2D(),
    field: field,
    imageSrc: "./img/samurai/Idle.png",
    scale: 2.5,
    framesMax: 8,
    offset: {x: 216, y: 156},
    sprites: {
        idle: {
            imageSrc: "./img/samurai/Idle.png",
            framesMax: 8
        },
        run: {
            imageSrc: "./img/samurai/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/samurai/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/samurai/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/samurai/Attack1.png",
            framesMax: 6
        },
        takeHit: {
            imageSrc: "./img/samurai/Take Hit.png",
            framesMax: 4
        },
        death: {
            imageSrc: "./img/samurai/Death.png",
            framesMax: 6
        }
    },
    attackParam: {
        offset: new P2D(100, 50),
        width: 160,
        height: 50
    }
});
console.info(`player1`, player);

const enemy = new Fighter({
    position: new P2D(400, 100),
    velocity: new P2D(),
    turn: true,
    offset: new P2D(-50),
    field: field,
    imageSrc: "./img/kenji/Idle.png",
    scale: 2.5,
    framesMax: 4,
    offset: {x: 216, y: 168},
    /**
     * @todo 地面と同様に一回canvasを挟んで画像の変換処理を通したものを描画するようにする
     */
    sprites: {
        idle: {
            imageSrc: "./img/kenji/Idle.png",
            framesMax: 4
        },
        run: {
            imageSrc: "./img/kenji/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/kenji/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/kenji/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/kenji/Attack1.png",
            framesMax: 4
        },
        takeHit: {
            imageSrc: "./img/kenji/Take Hit.png",
            framesMax: 4
        },
        death: {
            imageSrc: "./img/kenji/Death.png",
            framesMax: 7
        }
    },
    /**
     * @todo 左右反転時にも座標を対応させる
     */
    attackParam: {
        offset: new P2D(-170, 50),
        width: 170,
        height: 50
    }
});
console.info(`player2`, enemy);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

title();

function title() {
    c.fillStyle = "#fff";
    c.font = "50px sansserif"
    c.fillText("Press to: ctrl+s", 200, 400);
    document.addEventListener("keydown", e => {
        if(e.key == "s" && e.ctrlKey) {
            animate();
            decreaseTimer(player, enemy);
            calculator.start();
            document.getElementById("top").style.display = "flex";
        }
    })
}

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    /**
     * @todo 無理やり読み込んでるので非同期処理でどうにかcanvasの読み込みを間に合わせる
     */
    G.drawAll();
    layer1.update(c);
    layer2.update(c);
    layer3.update(c);
    ground.update(c);
    shop.update(c);
    c.fillStyle = "rgba(255, 255, 255, 0.15)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update(c);
    enemy.update(c);

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if(keys.a.pressed && player.lastKey == 'a' || keys.a.pressed && !keys.d.pressed) {
        player.velocity.x = -5;
        player.switchSprite("run");
    } else if(keys.d.pressed && player.lastKey == 'd' || !keys.a.pressed && keys.d.pressed) {
        player.velocity.x = 5;
        player.switchSprite("run");
    } else {
        player.switchSprite("idle");
    }

    if(player.velocity.y < 0) {
        player.switchSprite("jump");
    } else if(player.velocity.y > 0) {
        player.switchSprite("fall");
    }

    // enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft" || keys.ArrowLeft.pressed && !keys.ArrowRight.pressed) {
        enemy.velocity.x = -5;
        enemy.switchSprite("run");
    } else if(keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight" || !keys.ArrowLeft.pressed && keys.ArrowRight.pressed) {
        enemy.velocity.x = 5;
        enemy.switchSprite("run");
    } else {
        enemy.switchSprite("idle");
    }

    if(enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
    } else if(enemy.velocity.y > 0) {
        enemy.switchSprite("fall");
    }

    // detect for collision[player]
    if(rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking && player.framesCurrent == 4) {
        enemy.takeHit();
        player.isAttacking = false;
        document.getElementById("enemyHealth").firstElementChild.style.width = `${enemy.health}%`;
    }
    // detect for collision[player]
    if(rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking && enemy.framesCurrent == 2) {
        player.takeHit();
        enemy.isAttacking = false;
        document.getElementById("playerHealth").firstElementChild.style.width = `${player.health}%`;
    }

    // if player misses
    if(player.isAttacking && player.framesCurrent == 4) {
        player.isAttacking = false;
    }
    // if enemy misses
    if(enemy.isAttacking && enemy.framesCurrent == 2) {
        enemy.isAttacking = false;
    }

    // end game base on health
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinnder({player, enemy, timerId});
    }
}

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -20;
            break;
        case " ":
            player.attack();
            break;
    }

    switch (event.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            break;
        case "ArrowUp":
            enemy.velocity.y = -20;
            break;
        case "ArrowDown":
            enemy.attack();
            break;
        default:
            break;
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        default:
            break;
    }
    // enemy keys
    switch (event.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
        default:
            break;
    }
})