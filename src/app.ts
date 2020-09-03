import "./style.css";

import * as PIXI from "pixi.js";
import * as WebFont from "webfontloader";

import { Inventory } from "./Inventory";
import { Item } from "./Item";

let app: PIXI.Application;

function init() {
  app = new PIXI.Application({
    antialias: true,
    resolution: devicePixelRatio,
  });
  app.renderer.resize(window.innerWidth, window.innerHeight);
  document.body.appendChild(app.view);

  const bg = new PIXI.Sprite(
    PIXI.Texture.from(require("./assets/bg.jpg").default)
  );
  bg.filters = [new PIXI.filters.BlurFilter(5)];
  bg.width = window.innerWidth;
  bg.height = window.innerHeight;
  app.stage.addChild(bg);

  const inv = new Inventory();
  app.stage.addChild(inv.stage);

  inv.slots[10].set(new Item(app.stage, "explosive.timed", 5));
  inv.slots[11].set(new Item(app.stage, "wood", 100));
  inv.slots[12].set(new Item(app.stage, "stones", 1000));
  inv.slots[13].set(new Item(app.stage, "bandage", 3));
  inv.slots[14].set(new Item(app.stage, "ammo.rifle", 42));
  inv.slots[26].set(new Item(app.stage, "syringe.medical", 2));
  inv.slots[27].set(new Item(app.stage, "bandage", 2));
  inv.slots[28].set(new Item(app.stage, "knife.bone", 1));
  inv.slots[29].set(new Item(app.stage, "torch", 1));
  inv.slots[32].set(new Item(app.stage, "rifle.ak", 1));
  inv.slots[33].set(new Item(app.stage, "rifle.semiauto", 1));
  inv.slots[70].set(new Item(app.stage, "crossbow", 1));

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  // render the stage
  app.renderer.render(app.stage);
}

WebFont.load({
  google: {
    families: ["Roboto Condensed:700"],
  },
  active: (e) => {
    console.log("font loaded!");
    init();
  },
});
