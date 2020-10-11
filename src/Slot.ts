import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import { Item } from "./Item";
import { Inventory } from "./Inventory";
import { Tween, remove } from "@tweenjs/tween.js";

const slotPopAmount = 4;

export class Slot {
  id: number;
  sprite: PIXI.Sprite;
  spinner: PIXI.Sprite;
  mask: PIXI.Graphics;
  centerX: number;
  centerY: number;
  size: number;
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
    this.size = size;
    this.centerX = x + size / 2;
    this.centerY = y + size / 2;

    this.sprite = new PIXI.Sprite(inventory.slotTexture);
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.alpha = 0.5;
    // mouse events
    this.sprite.interactive = true;
    this.sprite
      .on("click", () => inventory.click(this.id))
      .on("mousedown", (e) => inventory.mouseDown(e, this.id))
      .on("mouseup", () => inventory.mouseUp())
      .on("mousemove", () => inventory.mouseMove())
      .on("mouseover", () => {
        inventory.dragTo = this.id;
        inventory.clickSound.play();
        this.onHover();
      });
    inventory.slotContainer.addChild(this.sprite);

    this.spinner = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.spinner.width = size;
    this.spinner.height = size;
    this.spinner.anchor.set(0.5);
    this.spinner.position.x = this.centerX;
    this.spinner.position.y = this.centerY;
    this.spinner.tint = 0x9cce3d;
    inventory.spinnerContainer.addChild(this.spinner);

    this.mask = new PIXI.Graphics();
    this.spinner.mask = this.mask;

    inventory.spinnerContainer.addChild(this.mask);
  }

  rightClick() {

    new TWEEN.Tween({ phase: Math.PI * 0.01 })
      .to({ phase: Math.PI * 2 }, 350)
      .onUpdate((obj) => {
        const radius = this.size / 6.5;
        const angleStart = Math.PI / 2;
        const angle = obj.phase + angleStart;
        const x1 = Math.cos(angleStart) * radius;
        const y1 = Math.sin(angleStart) * radius;
        this.mask.clear();
        this.mask.beginFill();
        this.mask.moveTo(this.centerX, this.centerY);
        this.mask.lineTo(this.centerX + x1, this.centerY + y1);
        this.mask.arc(
          this.centerX,
          this.centerY,
          radius,
          angleStart,
          angle,
          true
        );
        this.mask.lineTo(this.centerX, this.centerY);
        this.mask.endFill();
      })
      .onComplete(() => {
        console.log("done");
      })
      .start(TWEEN.now());
  }

  active() {
    this.sprite.tint = 0x5cb7ff;
    this.sprite.alpha = 0.9;
  }

  inactive() {
    this.sprite.tint = 0xffffff;
    this.sprite.alpha = 0.5;
  }

  public set item(v: Item | null) {
    this._item = v;
    this.updateItem();
  }

  public get item(): Item | null {
    return this._item;
  }

  onHover() {
    if (this.animated) return;

    this.animated = true;
    this.sprite.x -= slotPopAmount;
    this.sprite.y -= slotPopAmount;
    this.sprite.width += slotPopAmount * 2;
    this.sprite.height += slotPopAmount * 2;

    new TWEEN.Tween({
      x: this.sprite.x,
      y: this.sprite.y,
      width: this.sprite.width,
      height: this.sprite.height,
    })
      .to(
        {
          x: `+${slotPopAmount}`,
          y: `+${slotPopAmount}`,
          width: `-${slotPopAmount * 2}`,
          height: `-${slotPopAmount * 2}`,
        },
        100
      )
      .onUpdate((obj) => {
        this.sprite.x = obj.x;
        this.sprite.y = obj.y;
        this.sprite.width = obj.width;
        this.sprite.height = obj.height;
        this.updateItem();
      })
      .onComplete(() => {
        this.animated = false;
      })
      .start(TWEEN.now());
  }

  updateItem() {
    if (this._item) {
      this._item.stage.position.x = this.sprite.x;
      this._item.stage.position.y = this.sprite.y;
      this._item.stage.width = this.sprite.width;
      this._item.stage.height = this.sprite.height;
    }
  }
}
