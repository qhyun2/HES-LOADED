import * as PIXI from "pixi.js"

export class Slot {

    sprite: PIXI.Sprite;

    constructor(x: number, y: number, width: number, height: number, texture: any) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.width = width;
        this.sprite.height = height;
    }
}