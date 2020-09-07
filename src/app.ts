import "./style.css";

import * as PIXI from "pixi.js";
import * as WebFont from "webfontloader";

// NOTE: workaround being used for module
// in tween package.json, change module: dist/tween.esm.js => dist/tween.amd.js
import * as TWEEN from "@tweenjs/tween.js";

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

  inv.slots[70].item = new Item(app.stage, "crossbow");
  inv.slots[27].item = new Item(app.stage, "bandage", 2);
  inv.slots[28].item = new Item(app.stage, "knife.bone");
  inv.slots[29].item = new Item(app.stage, "torch");
  inv.slots[32].item = new Item(app.stage, "rifle.ak");
  inv.slots[33].item = new Item(app.stage, "rifle.semiauto");

  inv.addItem(new Item(app.stage, "wood", 950));
  inv.addItem(new Item(app.stage, "explosive.timed", 5));
  inv.addItem(new Item(app.stage, "wood", 100));
  inv.addItem(new Item(app.stage, "stones", 900));
  inv.addItem(new Item(app.stage, "bandage", 3));
  inv.addItem(new Item(app.stage, "ammo.rifle", 42));
  inv.addItem(new Item(app.stage, "syringe.medical"));
  inv.addItem(new Item(app.stage, "stones", 500));
  inv.addItem(new Item(app.stage, "stones", 300));
  inv.addItem(new Item(app.stage, "attire.hide.boots"));
  inv.addItem(new Item(app.stage, "bbq"));
  inv.addItem(new Item(app.stage, "hammer"));
  inv.addItem(new Item(app.stage, "stones", 150));
  inv.addItem(new Item(app.stage, "attire.hide.boots"));
  inv.addItem(new Item(app.stage, "hazmatsuit"));

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
