import { TilesetEditor } from "./myCC.js";

export const ground = new TilesetEditor({
    imageSrc: "./img/tileset/oak_woods_tileset.png",
    scale: 24
});
ground.resizeShape(44, 4);
for(let i = 0; i < 22; i++) {
    ground.selectTile(6, 0);
    ground.selectTile(7, 0);
}
for(let i = 0; i < 44*3; i++) {
    ground.selectTile(1, 1);
}
// 読み込み切れてないっぽい
ground.drawAll();