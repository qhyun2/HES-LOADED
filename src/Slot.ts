import * as PIXI from "pixi.js";
import { Item } from "./Item";
import { Inventory } from "./Inventory";

export class Slot {
  id: number;
  sprite: PIXI.Sprite;
  item?: Item;

  constructor(
    x: number,
    y: number,
    size: number,
    id: number,
    inventory: Inventory
  ) {
    this.id = id;

    this.sprite = new PIXI.Sprite(inventory.slotTexture);
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.alpha = 0.5;

    // mouse events
    this.sprite.interactive = true;
    this.sprite
      .on("mousedown", (e) => {
        if (this.item) inventory.mouseDown(e, this.id);
      })
      .on("mouseup", () => inventory.mouseUp())
      .on("mousemove", () => inventory.onDragMove())
      .on("mouseover", () => (inventory.dragTo = this.id));

    inventory.stage.addChild(this.sprite);
  }

  set(item?: Item) {
    if (!item) {
      this.item!.destory();
      return;
    }

    this.item = item;

    if (this.item) {
      this.item.stage.position.x = this.sprite.x;
      this.item.stage.position.y = this.sprite.y;
      this.item.stage.width = this.sprite.width;
      this.item.stage.height = this.sprite.height;
    }
  }
}
