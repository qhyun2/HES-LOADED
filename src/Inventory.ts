import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";
import * as _ from "lodash";

import { Slot } from "./Slot";
import { generateInventory, createBar } from "./InventoryHelper";

const shift = -200;

export class Inventory {
  stage: PIXI.Container;
  slots: Slot[] = [];

  slotTexture = PIXI.Texture.from(require("./assets/slot.png").default);
  barTexture = PIXI.Texture.from(require("./assets/bar.png").default);

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
    this.stage = new PIXI.Container();

    // back panel
    const back = new PIXI.Sprite(PIXI.Texture.EMPTY);
    back.width = window.innerWidth;
    back.height = window.innerWidth;
    back.interactive = true;
    back.on("mouseup", () => this.swap(this.dragFrom, -1));
    this.stage.addChild(back);

    generateInventory(this.stage, this);

    // text boxes
    this.stage.addChild(createBar(250 + shift + 3, this.barTexture));
    this.stage.addChild(createBar(666 + shift + 3, this.barTexture));
    this.stage.addChild(createBar(787 + shift + 3, this.barTexture));

    this.ghost = new PIXI.Sprite();
    this.ghost.alpha = 0.6;
    this.ghost.anchor.set(0.5);
    this.stage.addChild(this.ghost);
  }

  select(id: number) {
    this.slots[this.selected].inactive();
    if (id < 0) return;
    this.selected = id;
    this.slots[this.selected].active();
  }

  mouseDown(event: PIXI.InteractionEvent, id: number) {
    if (!this.slots[id].item) return;

    this.dragFrom = id;
    this.dragTo = id;
    this.data = event.data;
    this.dragStart = new PIXI.Point();
    _.sample(this.pickupSounds).play();

    event.data.getLocalPosition(this.stage, this.dragStart);
  }

  mouseUp() {
    if (this.slots[this.dragFrom].item) _.sample(this.dropSounds).play();

    this.swap(this.dragFrom, this.dragTo);
    this.dragStart = undefined;
    this.ghost.visible = false;
    this.dragTo = -1;
    this.dragFrom = -1;
    this.select(-1);
  }

  onDragMove() {
    if (this.dragFrom === -1) return;

    if (this.dragStart && this.data) {
      const p = this.data.getLocalPosition(this.stage);
      if (40 < (this.dragStart.x - p.x) ** 2 + (this.dragStart.y - p.y) ** 2) {
        this.ghost.visible = true;
        this.ghost.texture = this.slots[this.dragFrom].item!.sprite.texture;
        this.ghost.width = 90;
        this.ghost.height = 90;
        this.dragStart = undefined;
      }
    }

    if (this.data) {
      this.data.getLocalPosition(this.stage, this.ghost.position);
    }
  }

  swap(from: number, to: number) {
    if (from === to) return;

    if (to === -1) {
      this.slots[this.dragFrom].item?.destory();
      this.slots[this.dragFrom].item = null;
    }

    if (this.dragFrom != -1) {
      if (this.dragTo != -1) {
        this.slots[this.dragTo].item = this.slots[this.dragFrom].item!;
      }
      this.slots[this.dragFrom].item = null;
    }
  }
}
