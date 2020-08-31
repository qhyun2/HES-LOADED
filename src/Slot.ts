import * as PIXI from "pixi.js";
import { Item } from "./Item";

export class Slot {
  sprite: PIXI.Sprite;
  item: Item | null = null;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    texture: any
  ) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.width = width;
    this.sprite.height = height;
  }

  move(item:Item): Item | null {
    const temp = this.item;
    this.item = item;

    // this.sprite.texture =

    return temp
  }
}
