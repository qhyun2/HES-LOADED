import * as PIXI from "pixi.js";
import { Item } from "./Item";
import { Inventory } from "./Inventory";

const padding = 6;

export class Slot {
  id: number;
  sprite: PIXI.Sprite;
  item?: Item;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    id: number,
    inventory: Inventory
  ) {
    this.id = id;

    this.sprite = new PIXI.Sprite(inventory.slotTexture);
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.width = width;
    this.sprite.height = height;

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
      this.item.sprite.position.x = this.sprite.x + padding;
      this.item.sprite.position.y = this.sprite.y + padding;
      this.item.sprite.width = this.sprite.width - padding * 2;
      this.item.sprite.height = this.sprite.height - padding * 2;
    }
  }
}
