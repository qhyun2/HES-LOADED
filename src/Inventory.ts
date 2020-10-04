import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import * as _ from "lodash";

import { Slot } from "./Slot";
import { generateInventory, isArmorSlot } from "./InventoryHelper";
import { Item } from "./Item";

const shift = -200;

export class Inventory {
  slotContainer: PIXI.Container;
  itemContainer: PIXI.Container;
  stage: PIXI.Container;
  slots: Slot[] = [];

  slotTexture = PIXI.Texture.from(require("./assets/slot.png").default);

  clickSound = new Howl({
    src: [require("./assets/inventory_click.wav").default],
  });

  pickupSounds = [
    new Howl({
      src: [require("./assets/ui-pickup-leather-1.wav").default],
      volume: 0.25,
    }),
    new Howl({
      src: [require("./assets/ui-pickup-leather-2.wav").default],
      volume: 0.25,
    }),
    new Howl({
      src: [require("./assets/ui-pickup-leather-3.wav").default],
      volume: 0.25,
    }),
    new Howl({
      src: [require("./assets/ui-pickup-leather-4.wav").default],
      volume: 0.25,
    }),
  ];

  dropSounds = [
    new Howl({
      src: [require("./assets/ui-drop-leather-1.wav").default],
      volume: 0.25,
    }),
    new Howl({
      src: [require("./assets/ui-drop-leather-2.wav").default],
      volume: 0.25,
    }),
    new Howl({
      src: [require("./assets/ui-drop-leather-3.wav").default],
      volume: 0.25,
    }),
    new Howl({
      src: [require("./assets/ui-drop-leather-4.wav").default],
      volume: 0.25,
    }),
  ];

  // dragging
  dragFrom = -1;
  dragTo = -1;
  dragStart?: PIXI.Point;
  data: PIXI.InteractionData | null = null;
  ghost: PIXI.Sprite;

  selected = 0;

  constructor() {
    this.slotContainer = new PIXI.Container();
    this.itemContainer = new PIXI.Container();
    this.stage = new PIXI.Container();

    this.stage.addChild(this.slotContainer)
    this.stage.addChild(this.itemContainer)

    this.ghost = new PIXI.Sprite();
    this.ghost.alpha = 0.6;
    this.ghost.anchor.set(0.5);
    this.stage.addChild(this.ghost);

    // back panel
    const back = new PIXI.Sprite(PIXI.Texture.EMPTY);
    back.width = window.innerWidth;
    back.height = window.innerWidth;
    back.interactive = true;
    back.on("mouseup", () => {
      this.dragTo = -1;
      this.mouseUp();
    });
    this.slotContainer.addChild(back);

    generateInventory(this.slotContainer, this);
  }

  // select a slot to make it active
  // deselect previous slot, as there is only 1 active slot
  click(id: number) {

    console.log(id)

    this.slots[this.selected].inactive();
    if (id < 0) return;
    this.selected = id;
    this.slots[this.selected].active();
  }

  // add given item into first available inventory slot
  // does not try to stack items
  // returns whether addition has succeeded
  addItem(item: Item): boolean {
    for (let i = 7; i < 37; i++) {
      if (!this.slots[i].item) {
        this.slots[i].item = item;
        return true;
      }
    }
    return false;
  }

  mouseDown(event: PIXI.InteractionEvent, id: number) {
    if (!this.slots[id].item) return;

    this.dragFrom = id;
    this.dragTo = id;
    this.data = event.data;
    this.dragStart = new PIXI.Point();
    _.sample(this.pickupSounds).play();

    event.data.getLocalPosition(this.slotContainer, this.dragStart);
  }

  mouseUp() {
    if (this.slots[this.dragFrom]?.item) _.sample(this.dropSounds).play();

    this.moveItem(this.dragFrom, this.dragTo);
    this.dragStart = undefined;
    this.ghost.visible = false;
    this.dragTo = -1;
    this.dragFrom = -1;
    this.click(-1);
  }

  mouseMove() {
    if (this.dragFrom === -1) return;

    if (this.dragStart && this.data) {
      const p = this.data.getLocalPosition(this.slotContainer);
      if (40 < (this.dragStart.x - p.x) ** 2 + (this.dragStart.y - p.y) ** 2) {
        this.ghost.visible = true;
        this.ghost.texture = this.slots[this.dragFrom].item!.sprite.texture;
        this.ghost.width = 90;
        this.ghost.height = 90;
        this.dragStart = undefined;
      }
    }

    if (this.data) {
      this.data.getLocalPosition(this.slotContainer, this.ghost.position);
    }
  }

  // moves an item from a given slot to a give slot
  // handles many special cases
  moveItem(from: number, to: number) {
    // I'm not seeing enough movement
    if (from === to) return;

    // this should not happen
    if (from === -1) return;

    // item is being thrown out
    if (to === -1) {
      this.slots[from].item?.destory();
      this.slots[from].item = null;
      return;
    }

    const fromItem = this.slots[from].item!;
    const toItem = this.slots[to].item;

    // trying to put non armor item in armor slot
    if (isArmorSlot(to) && !fromItem.wearable) return

    this.slots[from].item = null;

    // item is being moved to empty slot
    if (!toItem) {
      this.slots[to].item = fromItem;
      return;
    }

    // item is different from the destination or non-stackable, swap normally
    if (fromItem.name !== toItem.name || toItem.maxStack === 1) {
      this.slots[from].item = toItem;
      this.slots[to].item = fromItem;
      return;
    }

    // destination item stack is full, keep item where it was
    if (toItem.count === toItem.maxStack) {
      this.slots[from].item = fromItem;
      return;
    }

    // item merged into destination stack
    if (toItem.count + fromItem.count <= toItem.maxStack) {
      toItem.count += fromItem.count;
      fromItem.destory();
      return;
    }

    // full stack created with some leftover,
    // re-add to inventory at first possible slot
    fromItem.count -= toItem.maxStack - toItem.count;
    toItem.count = toItem.maxStack;
    this.addItem(fromItem);
  }
}
