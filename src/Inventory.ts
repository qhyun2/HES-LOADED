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
  stage = new PIXI.Container();
  slotTexture = PIXI.Texture.from(require("./assets/icon.png").default);
  slots: Slot[] = [];

  dragging = false;
  draggingItem: Item | null = null;
  draggingId = 0;

  // dragging
  data: PIXI.InteractionData | null = null;

  constructor() {
    let id = 0;

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

  onDragStart(event: PIXI.InteractionEvent, id: number) {
    this.dragging = true;
    this.draggingId = id;
    this.data = event.data;
    console.log("start", id);
  }

  onDragEnd() {
    this.dragging = false;
    this.data = null;
    console.log("end", this.draggingId);
  }

  onDragMove() {
    if (this.dragging) {
      var newPosition = this.data!.getLocalPosition(this.stage);
      this.slots[this.draggingId].item!.sprite.position.copyFrom(newPosition)
    }
  }
}
