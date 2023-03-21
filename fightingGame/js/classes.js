import { P2D } from "./myCC.js"
export { Field, Sprite, Fighter }

class Field {
    /**
     * 
     * @param {{gravity: Number}} 
     */
    constructor({width, height, gravity}) {
        this.width = width;
        this.height = height;
        this.gravity = gravity;
    }
}

class Sprite {
    /**
     * 
     * @param {{position: P2D, imageSrc: String|HTMLCanvasElement, scale: Number, framesMax: Number, framesHold: Number}} 
     */

    constructor({position, imageSrc, scale = 1, framesMax = 1, framesHold = 20, offset = {x: 0, y: 0}}) {
        this.position = position;
        if(imageSrc instanceof HTMLCanvasElement) {
            this.image = imageSrc;
        } else {
            this.image = new Image();
            this.image.src = imageSrc;
        }
        this.scale = scale;

        this.framesMax = framesMax;
        this.framesWidth = this.image.width / this.framesMax;
        this.framesCurrent = 0;
        this.framesErapsed = 0;
        this.framesHold = framesHold;

        this.offset = offset;
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} c 
     */
    draw(c) {
        c.drawImage(this.image, this.framesCurrent * this.framesWidth, 0, this.framesWidth, this.image.height, this.position.x - this.offset.x, this.position.y - this.offset.y, this.framesWidth * this.scale, this.image.height * this.scale);
    }
    /**
     * 
     */
    drawT(c) {
        let canvas = document.createElement("canvas");
        canvas.height = this.image.height;
        canvas.width = this.framesWidth;
        let ctx = canvas.getContext("2d");
        ctx.scale(-1,1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(this.image, this.framesCurrent * this.framesWidth, 0, this.framesWidth, this.image.height, 0, 0, this.framesWidth, this.image.height);
        c.drawImage(canvas, this.position.x - this.offset.x, this.position.y - this.offset.y, this.framesWidth * this.scale, this.image.height * this.scale);
    }
    animateFrame() {
        this.framesErapsed++;
        if((this.framesErapsed %= this.framesHold) == 0) {
            this.framesCurrent++;
            this.framesCurrent %= this.framesMax;
        }
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} c 
     */
    update(c) {
        this.animateFrame();
        this.draw(c);
    }
}

class Fighter extends Sprite {
    /**
     * 
     * @param {{position: P2D, velocity: P2D, turn: Boolean, offset: P2D, field: Field, imageSrc: String, scale: Number, framesMax: Number, framesHold: Number, offset: P2D, sprites: {}, attackParam: {offset: P2D, width: Number, height: Number}}}} 
     */
    constructor({position, velocity, turn = false, field, imageSrc, scale = 1, framesMax = 1, framesHold = 5, offset = new P2D(0, 0), sprites, attackParam = {offset: new P2D(0, 0), width: 100, height: 100}}) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            framesHold,
            offset
        })

        this.velocity = velocity;
        this.width = 100;
        this.height = 150;
        this.lastKey;
        this.attackParam = {
            offset: attackParam.offset,
            width: attackParam.width,
            height: attackParam.height
        }
        this.turn = turn;
        this.isAttacking;
        this.health = 100;
        this.field = field;
        this.sprites = sprites;
        this.dead = false;

        for(let sprite in sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }
    get attackBox() {
        return P2D.add(this.position, this.attackParam.offset);
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} c
     */
    update(c) {
        if(this.turn) this.drawT(c);
        else this.draw(c);
        if(this.dead) return;
        
        this.animateFrame();
        this.position.add(this.velocity);

        // draw collision
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.fillStyle = "rgba(0,0,0,0.3)";
        c.fillRect(this.attackBox.x, this.attackBox.y, this.attackParam.width, this.attackParam.height);

        if(this.position.y + this.height + this.velocity.y >= this.field.height) {
            this.velocity.y = 0;
            this.position.y = this.field.height - this.height;
        } else {
            this.velocity.y += this.field.gravity;
        }
    }

    attack() {
        this.switchSprite("attack1");
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 20;        
        if(this.health <= 0) {
            this.switchSprite("death");
        } else {
            this.switchSprite("takeHit");
        }
    }

    switchSprite(sprite) {
        if(this.image == this.sprites["death"].image) {
            if(this.framesCurrent == this.sprites["death"].framesMax - 1) this.dead = true;
            return;
        }

        // overriding all other animations with the attack animation
        if(this.image == this.sprites["attack1"].image && this.framesCurrent < this.sprites["attack1"].framesMax - 1) {
            return;
        }

        // overriding whe fighter gets hit
        if(this.image == this.sprites["takeHit"].image && this.framesCurrent < this.sprites["takeHit"].framesMax - 1) {
            return;
        }

        if(this.image != this.sprites[sprite].image) {
            this.image = this.sprites[sprite].image;
            this.framesMax = this.sprites[sprite].framesMax;
            this.framesCurrent = 0;
        }
    }
}