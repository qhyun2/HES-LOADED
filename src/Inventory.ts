import * as PIXI from "pixi.js";

import { Slot } from "./Slot";
import { Item } from "./Item";

const shift = -200;
const padding = 7;

const armorX = 72;
const armorY = 832;
const armorSize = 75;

const mainX = 655;
const mainY = 573;
const mainSize = 90;

const hotbarX = 656;
const hotbarY = 963;

const lootX = 1252;
const lootY = 291;
const lootSize = 87;

const lootArmorX = 1258;
const lootArmorY = 706;
const lootArmorSize = 72;

const lootHotbarX = 1252;
const lootHotbarY = 828;

export class Inventory {
  stage: PIXI.Container;
  slotTexture = PIXI.Texture.from(require("./assets/icon.png").default);
  slots: Slot[] = [];

  dragging = false;
  dragFrom = 0;
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
        armorX + (armorSize + padding) * i,
        armorY + shift,
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
          mainX + (mainSize + padding) * x,
          mainY + shift + (mainSize + padding) * y,
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
        hotbarX + (mainSize + padding) * i,
        hotbarY + shift,
        mainSize,
        mainSize,
        id++,
        this
      );
      this.slots.push(s);
    }

    // text boxes
    // graphics.drawRect(1243, 250 + shift, 570, 32);
    // graphics.drawRect(1243, 666 + shift, 570, 32);
    // graphics.drawRect(1243, 787 + shift, 570, 32);

    // loot armor slots
    for (let i = 0; i < 7; i++) {
      const s = new Slot(
        lootArmorX + (lootArmorSize + padding) * i,
        lootArmorY + shift,
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
          lootX + (lootSize + padding) * x,
          lootY + shift + (lootSize + padding) * y,
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
        lootHotbarX + (lootSize + padding) * i,
        lootHotbarY + shift,
        lootSize,
        lootSize,
        id++,
        this
      );
      this.slots.push(s);
    }
  }

  mouseDown(event: PIXI.InteractionEvent, id: number) {
    this.dragging = true;
    this.dragFrom = id;
    this.data = event.data;
  }

  mouseUp() {
    console.log("mouseup", this.dragging, this.dragTo, this.dragFrom)
    if (this.dragging) {
        if (this.dragTo === -1) {
            this.slots[this.dragFrom].set();
        } else {
            this.slots[this.dragTo].set(this.slots[this.dragFrom].item!);
        }
    }
    this.dragging = false;
  }

  discard() {
      this.dragging = false;
      this.slots[this.dragFrom].set()
  }

  onDragMove() {
    if (this.dragging && this.data) {
      var newPosition = this.data.getLocalPosition(this.stage);
      this.slots[this.dragFrom].item!.sprite.position.copyFrom(newPosition);
    }
  }
}
