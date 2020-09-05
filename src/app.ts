import "./style.css";

import * as PIXI from "pixi.js";
import * as WebFont from "webfontloader";

// NOTE: workaround being used for module
// in tween package.json, change module: dist/tween.esm.js => dist/tween.amd.js
import * as TWEEN from "@tweenjs/tween.js"

import { Inventory } from "./Inventory";
import { Item } from "./Item";

let app: PIXI.Application;

WebFont.load({
  google: {
    families: ["Roboto Condensed:700"],
  },
  // start app once fonts are loaded
  active: (e) => {
    init();
  },
});




function init() {
  app = new PIXI.Application({
    antialias: true,
    resolution: devicePixelRatio || 1,
  });
  window.addEventListener("resize", resize);
  resize();
  document.body.appendChild(app.view);

  const bg = new PIXI.Sprite(
    PIXI.Texture.from(require("./assets/bg.jpg").default)
  );
  bg.filters = [new PIXI.filters.BlurFilter(5)];
  bg.width = 1920;
  bg.height = 1080;
  app.stage.addChild(bg);

  const inv = new Inventory();
  app.stage.addChild(inv.stage);

  inv.slots[10].item = new Item(app.stage, "explosive.timed", 5);
  inv.slots[11].item = new Item(app.stage, "wood", 100);
  inv.slots[12].item = new Item(app.stage, "stones", 1000);
  inv.slots[13].item = new Item(app.stage, "bandage", 3);
  inv.slots[14].item = new Item(app.stage, "ammo.rifle", 42);
  inv.slots[26].item = new Item(app.stage, "syringe.medical", 2);
  inv.slots[27].item = new Item(app.stage, "bandage", 2);
  inv.slots[28].item = new Item(app.stage, "knife.bone", 1);
  inv.slots[29].item = new Item(app.stage, "torch", 1);
  inv.slots[32].item = new Item(app.stage, "rifle.ak", 1);
  inv.slots[33].item = new Item(app.stage, "rifle.semiauto", 1);
  inv.slots[70].item = new Item(app.stage, "crossbow", 1);

  requestAnimationFrame(animate);
}

function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}

function animate(time: number) {
  TWEEN.update(time);

  // render the stage
  app.renderer.render(app.stage);

  requestAnimationFrame(animate);
}
