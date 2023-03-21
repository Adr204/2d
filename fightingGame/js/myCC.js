export { P2D, TilesetEditor }

class P2D {
    /**
     * 
     * @param {Number|P2D} x 
     * @param {Number} y 
     */
    constructor(x = 0, y = 0) {
        if(x instanceof P2D) {
            this.x = x.x;
            this.y = y.y;
        }
        this.x = x;
        this.y = y;
    }
    static add(...arg) {
        let x,y;
        x = y = 0;
        for(let item of arg) {
            x += item.x;
            y += item.y;
        }
        return new P2D(x, y);
    }
    /**
     * 
     * @param {P2D} p 
     */
    add(p) {
        this.x += p.x;
        this.y += p.y;
    }
}

class TilesetEditor {
    /**
     * 
     * @param {{imageSrc: String, scale: Number}} 
     */
    constructor({imageSrc, scale}) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.tilesets = [];
        this.width = 0;
        this.height = 0;
        this.scale = scale;
    }
    /**
     * 
     * @return {{x: Number, y: Number}}
     */
    get unspecifiedPos() {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(this.tilesets[y][x] == undefined) return {x, y};
            }
        }
    }
    get aspect() {
        return {x: this.image.width/scale, y: this.image.height/scale};
    }
    /**
     * @change
     * @param {Number} width
     * @param {Number} height
     */
    resizeShape(width, height) {
        console.log(width, height);
        this.width = width;
        this.height = height;

        this.canvas.width = this.width * this.scale;
        this.canvas.height = this.height * this.scale;
        
        this.tilesets = [];
        for(let y = 0; y < this.height; y++) {
            this.tilesets.push([]);
        }
    }
    /**
     * 
     * @param {Number} sx 挿入するタイルの座標
     * @param {Number} sy 挿入するタイルの座標
     * @param {Number|undefined} dx 挿入する先の座標
     * @param {Number|undefined} dy 挿入する先の座標
     */
    selectTile(sx, sy, dx = -1, dy = -1) {
        let p = !(dx+dy < 0 || dx*dy < 0) ? {x: dx, y: dy} : this.unspecifiedPos;
        this.tilesets[p.y][p.x] = {x: sx, y: sy};
    }
    drawTile(sx, sy, dx, dy) {
        let s = this.scale;
        this.ctx.drawImage(this.image, sx*s, sy*s, s, s, dx*s, dy*s, s, s);
    }
    drawAll() {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let p = this.tilesets[y][x];
                this.drawTile(p.x, p.y, x, y);
            }
        }
    }
}