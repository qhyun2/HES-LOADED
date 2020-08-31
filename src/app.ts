import * as PIXI from "pixi.js";

import { Inventory } from "./Inventory";

const app = new PIXI.Application({
  antialias: true,
  resolution: devicePixelRatio,
});
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);

const bg = new PIXI.Sprite(PIXI.Texture.from(require("./assets/bg.jpg").default));
bg.filters = [new PIXI.filters.BlurFilter()];
bg.width = window.innerWidth;
bg.height = window.innerHeight;
app.stage.addChild(bg);

const inv = new Inventory();
app.stage.addChild(inv.stage);
