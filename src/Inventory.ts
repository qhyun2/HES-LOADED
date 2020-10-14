import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import * as _ from "lodash";

import { Slot } from "./Slot";
import { generateInventory, isArmorSlot } from "./InventoryHelper";
import { Item } from "./Item";
import { playDropSound, playPickupSound } from "./Sound";

const shift = -200;

export class Inventory {
  slotContainer: PIXI.Container;
  itemContainer: PIXI.Container;
  spinnerContainer: PIXI.Container;
  stage: PIXI.Container;
  slots: Slot[] = [];

  slotTexture = PIXI.Texture.from(require("./assets/slot.png").default);

  // dragging
  dragFrom = -1;
  dragTo = -1;
  dragStart?: PIXI.Point;
  data: PIXI.InteractionData | null = null;
  ghost: PIXI.Sprite;
  middle = false;

  selected = 0;

  constructor() {
    this.slotContainer = new PIXI.Container();
    this.itemContainer = new PIXI.Container();
    this.spinnerContainer = new PIXI.Container();

    this.stage = new PIXI.Container();
    this.stage.addChild(this.slotContainer);
    this.stage.addChild(this.itemContainer);
    this.stage.addChild(this.spinnerContainer);

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
    this.slots[this.selected].inactive();
    if (id < 0) return;
    this.selected = id;
    this.slots[this.selected].active();
  }

  rightClick(e: MouseEvent) {
    this.slots.forEach((slot) => {
      if (slot.sprite.containsPoint(new PIXI.Point(e.x, e.y))) {
        slot.rightClick();
      }
    });
  }

  mouseDown(event: PIXI.InteractionEvent, id: number) {
    if (!this.slots[id].item) return;

    this.middle = event.data.button == 1;
    this.dragFrom = id;
    this.dragTo = id;
    this.data = event.data;
    this.dragStart = new PIXI.Point();
    playPickupSound();
  }

  mouseUp() {
    const itemMoved = this.moveItem(this.dragFrom, this.dragTo);
    if (itemMoved) playDropSound();
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
  // returns whether drop sound should be played
  moveItem(from: number, to: number): boolean {
    // I'm not seeing enough movement
    if (from === to) return false;

    // this should not happen
    if (from === -1) return false;

    // item is being thrown out
    if (to === -1) {
      this.slots[from].item?.destory();
      this.slots[from].item = null;
      return true;
    }

    let fromItem = this.slots[from].item!;
    let toItem = this.slots[to].item;

    // trying to put non armor item in armor slot
    if (isArmorSlot(to) && !fromItem.wearable) return false;

    this.slots[from].item = null;

    // item is being moved to empty slot
    if (!toItem) {
      // split stack with middle click
      if (this.middle && fromItem.count > 1) {
        this.slots[to].item = fromItem.copy();
        this.slots[to].item!.count = Math.floor(fromItem.count / 2);
        this.slots[from].item = fromItem;
        this.slots[from].item!.count = Math.ceil(fromItem.count / 2);
      } else {
        this.slots[to].item = fromItem;
      }
      return true;
    }

    // item is different from the destination or non-stackable, swap
    if (fromItem.name !== toItem.name || toItem.maxStack === 1) {
      // middle click, do nothing
      if (this.middle) {
        this.slots[from].item = fromItem;
        return false;
      }
      this.slots[from].item = toItem;
      this.slots[to].item = fromItem;
      return true;
    }

    // destination item stack is full, keep item where it was
    if (toItem.count === toItem.maxStack) {
      this.slots[from].item = fromItem;
      return true;
    }

    // try to merge items, add what is leftover back to inventory
    // in the case of stack splitting, only transfer half
    if (this.middle && fromItem.count != 1) {
      const splitCount = Math.floor(fromItem.count / 2);
      this.slots[from].item = fromItem;
      this.slots[from].item!.count = Math.ceil(fromItem.count / 2);
      fromItem = fromItem.copy();
      fromItem.count = splitCount;
    }

    this.addItem(toItem.merge(fromItem));
    return true;
  }

  // add given item into first available inventory slot
  // return what is left over
  addItem(item: Item | void, self = true, stack = false): Item | void {
    if (!item) return;

    var start, end: number;

    if (self) {
      // main inventory including hotbar
      start = 7;
      end = 37;
    } else {
      // main loot not including armour and hotbar
      start = 44;
      end = 67;
    }

    for (let i = start; i < end; i++) {
      if (!this.slots[i].item) {
        this.slots[i].item = item;
        return;
      }
    }
    return item;
  }

  addItemSelfStack(item: Item): Item | void {
    return this.addItem(item, true, true);
  }
  addItemLoot(item: Item): Item | void {
    return this.addItem(item, false, false);
  }
  addItemLootStack(item: Item): Item | void {
    return this.addItem(item, false, true);
  }
}
