import * as PIXI from "pixi.js";

import { Slot } from "./Slot";

const shift = -200;

const armorX = 72;
const armorY = 832 + shift;
const armorSize = 81;

const mainX = 655;
const mainY = 573 + shift;
const mainSize = 96;

const hotbarX = 656;
const hotbarY = 963 + shift;

const lootX = 1252;
const lootY = 291 + shift;
const lootSize = 93;

const lootArmorX = 1258;
const lootArmorY = 706 + shift;
const lootArmorSize = 78;

const lootHotbarX = 1252;
const lootHotbarY = 828 + shift;

export class Inventory {
  stage: PIXI.Container;
  slotTexture = PIXI.Texture.from(require("./assets/slot.png").default);
  slots: Slot[] = [];

  dragFrom = -1;
  dragTo = -1;

  // dragging
  data: PIXI.InteractionData | null = null;

  constructor() {
    let id = 0;

    this.stage = new PIXI.Container();

    // back panel
    const back = new PIXI.Sprite(PIXI.Texture.EMPTY);
    back.width = window.innerWidth;
    back.height = window.innerWidth;
    back.interactive = true;
    back.on("mouseup", () => this.discard());
    this.stage.addChild(back);

    // armor slots
    for (let i = 0; i < 7; i++) {
      const s = new Slot(
        armorX + armorSize * i,
        armorY,
        armorSize,
        armorSize,
        id++,
        this
      );
      this.slots.push(s);
    }

    // main inventory
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 6; x++) {
        const s = new Slot(
          mainX + mainSize * x,
          mainY + mainSize * y,
          mainSize,
          mainSize,
          id++,
          this
        );
        this.slots.push(s);
      }
    }

    // hotbar
    for (let i = 0; i < 6; i++) {
      const s = new Slot(
        hotbarX + mainSize * i,
        hotbarY,
        mainSize,
        mainSize,
        id++,
        this
      );
      this.slots.push(s);
    }

    // text boxes
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xaaaaaa);
    graphics.alpha = 0.6
    graphics.drawRect(1243, 250 + shift + 3, 570, 32);
    graphics.drawRect(1243, 666 + shift + 3, 570, 32);
    graphics.drawRect(1243, 787 + shift + 3, 570, 32);
    graphics.endFill();
    this.stage.addChild(graphics);

    // loot armor slots
    for (let i = 0; i < 7; i++) {
      const s = new Slot(
        lootArmorX + lootArmorSize * i,
        lootArmorY,
        lootArmorSize,
        lootArmorSize,
        id++,
        this
      );
      this.slots.push(s);
    }

    // loot main inventory
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 6; x++) {
        const s = new Slot(
          lootX + lootSize * x,
          lootY + lootSize * y,
          lootSize,
          lootSize,
          id++,
          this
        );
        this.slots.push(s);
      }
    }

    // loot hotbar
    for (let i = 0; i < 6; i++) {
      const s = new Slot(
        lootHotbarX + lootSize * i,
        lootHotbarY,
        lootSize,
        lootSize,
        id++,
        this
      );
      this.slots.push(s);
    }

  let t = new PIXI.Text("INVENTORY");
  t.x = mainX + 5;
  t.y = mainY + 5;
  t.anchor.set(0, 1)
  t.style = new PIXI.TextStyle({
    fontFamily: "Roboto Condensed",
    fontWeight: "700",
    fill: 0xffffff,
    fontSize: 30,
    letterSpacing: 0.9
  });
  this.stage.addChild(t);

  }

  mouseDown(event: PIXI.InteractionEvent, id: number) {
    this.dragFrom = id;
    this.dragTo = id;
    this.data = event.data;
  }

  mouseUp() {
    if (this.dragFrom != -1) {
      if (this.dragTo != -1) {
        this.slots[this.dragTo].set(this.slots[this.dragFrom].item!);
      }
      this.slots[this.dragFrom].item = undefined;
    }
    console.log(this.slots[this.dragTo].item?.maxStack)
    this.dragFrom = -1;
    this.dragTo = -1;
  }

  discard() {
    this.slots[this.dragFrom].set();
    this.dragFrom = -1;
  }

  onDragMove() {
    if (this.dragFrom != -1 && this.data) {
      this.data.getLocalPosition(this.stage, this.slots[this.dragFrom].item!.sprite.position);
    }
  }
}
