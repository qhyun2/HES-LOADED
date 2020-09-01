import * as PIXI from "pixi.js";

import { Inventory } from "./Inventory";
import { Item } from "./Item";

const app = new PIXI.Application({
  antialias: true,
  resolution: devicePixelRatio,
});
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);

const bg = new PIXI.Sprite(
  PIXI.Texture.from(require("./assets/bg.jpg").default)
);
bg.filters = [new PIXI.filters.BlurFilter()];
bg.width = window.innerWidth;
bg.height = window.innerHeight;
app.stage.addChild(bg);

const inv = new Inventory();
app.stage.addChild(inv.stage);

inv.slots[10].set(new Item(app.stage, "explosive.timed", 1));
inv.slots[13].set(new Item(app.stage, "bandage", 1));
inv.slots[14].set(new Item(app.stage, "ammo.rifle", 1));
inv.slots[26].set(new Item(app.stage, "syringe.medical", 1));
inv.slots[27].set(new Item(app.stage, "bandage", 1));
inv.slots[28].set(new Item(app.stage, "knife.bone", 1));
inv.slots[29].set(new Item(app.stage, "torch", 1));
inv.slots[32].set(new Item(app.stage, "rifle.ak", 1));

function animate() {
  requestAnimationFrame(animate);
  // render the stage
  app.renderer.render(app.stage);
}
