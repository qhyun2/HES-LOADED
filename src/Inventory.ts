import * as PIXI from "pixi.js";

import { Slot } from "./Slot";
import { generateInventory, createBar } from "./InventoryHelper";

const shift = -200;

export class Inventory {
  stage: PIXI.Container;
  slots: Slot[] = [];

  slotTexture = PIXI.Texture.from(require("./assets/slot.png").default);
  barTexture = PIXI.Texture.from(require("./assets/bar.png").default);

  textHeadingStyle = new PIXI.TextStyle({
    fontFamily: "Roboto Condensed",
    fontWeight: "700",
    fill: 0xdddddd,
    fontSize: 30,
    letterSpacing: 0.9,
  });

  textBarStyle = new PIXI.TextStyle({
    fontFamily: "Roboto Condensed",
    fontWeight: "700",
    fill: 0xdddddd,
    fontSize: 20,
    letterSpacing: 0.9,
  });

  // dragging
  dragFrom = -1;
  dragTo = -1;
  data: PIXI.InteractionData | null = null;

  constructor() {
    this.stage = new PIXI.Container();

    // back panel
    const back = new PIXI.Sprite(PIXI.Texture.EMPTY);
    back.width = window.innerWidth;
    back.height = window.innerWidth;
    back.interactive = true;
    back.on("mouseup", () => this.discard());
    this.stage.addChild(back);

    // inventory slots
    generateInventory(this.stage, this);

    // text boxes
    this.stage.addChild(createBar(250 + shift + 3, this.barTexture));
    this.stage.addChild(createBar(666 + shift + 3, this.barTexture));
    this.stage.addChild(createBar(787 + shift + 3, this.barTexture));

    // labels
    let t = new PIXI.Text("INVENTORY");
    t.x = 660;
    t.y = 378;
    t.anchor.set(0, 1);
    t.style = this.textHeadingStyle;
    this.stage.addChild(t);

    t = new PIXI.Text("LOOT");
    t.x = 1243;
    t.y = 52;
    t.anchor.set(0, 1);
    t.style = this.textHeadingStyle;
    this.stage.addChild(t);

    t = new PIXI.Text("PlayerName");
    t.x = 1243 + 15;
    t.y = 52 + 5;
    t.anchor.set(0, 0);
    t.style = this.textBarStyle;
    this.stage.addChild(t);

    t = new PIXI.Text("Clothing");
    t.x = 1243 + 15;
    t.y = 469 + 5;
    t.anchor.set(0, 0);
    t.style = this.textBarStyle;
    this.stage.addChild(t);

    t = new PIXI.Text("Belt");
    t.x = 1243 + 15;
    t.y = 590 + 5;
    t.anchor.set(0, 0);
    t.style = this.textBarStyle;
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
    console.log(this.slots[this.dragTo].item?.maxStack);
    this.dragFrom = -1;
    this.dragTo = -1;
  }

  discard() {
    this.slots[this.dragFrom].set();
    this.dragFrom = -1;
  }

  onDragMove() {
    if (this.dragFrom != -1 && this.data) {
      this.data.getLocalPosition(
        this.stage,
        this.slots[this.dragFrom].item!.stage.position
      );
    }
  }
}
