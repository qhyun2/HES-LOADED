import * as PIXI from "pixi.js";
import { Item } from "./Item";
import { Inventory } from "./Inventory";

const padding = 6;

export class Slot {
  id: number;
  sprite: PIXI.Sprite;
  item: Item | null = null;
  dragStart = false;

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
    this.sprite.buttonMode = true;
    this.sprite
      .on("mousedown", (e) => {
        this.dragStart = true;
        inventory.onDragStart(e, this.id);
      })
      .on("mouseup", (e) => {
        // if drag start has been set it means this is the source slot
        // ignore this event as the desitnation slot also emmits and event
        inventory.onDragEnd;
      })
      .on("mouseupoutside", inventory.onDragEnd.bind(inventory))
      .on("mousemove", inventory.onDragMove.bind(inventory));

    inventory.stage.addChild(this.sprite);
  }

  move(item: Item | null): Item | null {
    const temp = this.item;
    this.item = item;

    if (this.item) {
      this.item.sprite.position.x = this.sprite.x + padding;
      this.item.sprite.position.y = this.sprite.y + padding;
      this.item.sprite.width = this.sprite.width - padding * 2;
      this.item.sprite.height = this.sprite.height - padding * 2;
    }

    return temp;
  }
}
