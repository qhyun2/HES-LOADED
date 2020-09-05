import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import { Item } from "./Item";
import { Inventory } from "./Inventory";
import { Tween, remove } from "@tweenjs/tween.js";

export class Slot {
  id: number;
  sprite: PIXI.Sprite;
  animated = false;
  _item: Item | null = null;

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
      .on("mousedown", (e) => inventory.mouseDown(e, this.id))
      .on("mouseup", () => inventory.mouseUp())
      .on("mousemove", () => inventory.onDragMove())
      .on("mouseover", () => {
        inventory.dragTo = this.id;
        this.onHover();
      })
      .on("click", () => this.active());

    inventory.stage.addChild(this.sprite);
  }

  active() {
    this.sprite.tint = 0x3595dc;
    this.sprite.alpha = 0.9;
  }

  inactive() {
    this.sprite.tint = 0xffffff;
    this.sprite.alpha = 0.5;
  }

  onHover() {
    if (this.animated) return;

    this.animated = true;

    const a = new TWEEN.Tween({
      x: this.sprite.x,
      y: this.sprite.y,
      width: this.sprite.width,
      height: this.sprite.height,
    })
      .to({ x: "-4", y: "-4", width: "+8", height: "+8" }, 200)
      .repeat(1)
      .yoyo(true)
      .easing(TWEEN.Easing.Quadratic.In)
      .onUpdate((obj) => {
        this.sprite.x = obj.x;
        this.sprite.y = obj.y;
        this.sprite.width = obj.width;
        this.sprite.height = obj.height;
      })
      .start(TWEEN.now())
      .onComplete(() => {
        this.animated = false;
      });
  }

  public set item(v: Item | null) {
    this._item = v;

    if (this._item) {
      this._item.stage.position.x = this.sprite.x;
      this._item.stage.position.y = this.sprite.y;
      this._item.stage.width = this.sprite.width;
      this._item.stage.height = this.sprite.height;
    }
  }
  public get item(): Item | null {
    return this._item;
  }
}
