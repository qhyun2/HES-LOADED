import * as PIXI from "pixi.js";

import { Slot } from "./Slot";

const app = new PIXI.Application({
  antialias: true,
  resolution: devicePixelRatio,
});

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

var button = PIXI.Texture.from(require("./assets/icon.png").default);

// app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.resize(window.innerWidth, 1080);

document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

// Rectangle
graphics.beginFill(0xaaaaaa);

// armor slots
for (let i = 0; i < 7; i++) {
  const s = new Slot(
    armorX + (armorSize + padding) * i,
    armorY + shift,
    armorSize,
    armorSize,
    button
  );
  app.stage.addChild(s.sprite);

}

// main inventory
for (let y = 0; y < 4; y++) {
  for (let x = 0; x < 6; x++) {
    graphics.drawRect(
      mainX + (mainSize + padding) * x,
      mainY + shift + (mainSize + padding) * y,
      mainSize,
      mainSize
    );
  }
}

// hotbar
for (let i = 0; i < 6; i++) {
  graphics.drawRect(
    hotbarX + (mainSize + padding) * i,
    hotbarY + shift,
    mainSize,
    mainSize
  );
}

//

// text boxes
graphics.drawRect(1243, 250 + shift, 570, 32);
graphics.drawRect(1243, 666 + shift, 570, 32);
graphics.drawRect(1243, 787 + shift, 570, 32);

// loot armor slots
for (let i = 0; i < 7; i++) {
  graphics.drawRect(
    lootArmorX + (lootArmorSize + padding) * i,
    lootArmorY + shift,
    lootArmorSize,
    lootArmorSize
  );
}

// loot main inventory
for (let y = 0; y < 4; y++) {
  for (let x = 0; x < 6; x++) {
    graphics.drawRect(
      lootX + (lootSize + padding) * x,
      lootY + shift + (lootSize + padding) * y,
      lootSize,
      lootSize
    );
  }
}

// loot hotbar
for (let i = 0; i < 6; i++) {
  graphics.drawRect(
    lootHotbarX + (lootSize + padding) * i,
    lootHotbarY + shift,
    lootSize,
    lootSize
  );
}

graphics.endFill();
app.stage.addChild(graphics);
