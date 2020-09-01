import * as PIXI from "pixi.js";

export class Item {
  name: string;
  amount: number;
  sprite: PIXI.Sprite;
  wearable = false;
  maxStack = 0;

  constructor(stage: PIXI.Container, name: string, amount: number) {
    this.name = name;
    this.amount = amount;
    this.sprite = new PIXI.Sprite(
      PIXI.Texture.from(`./items/${this.name}.png`)
    );
    fetch(`./items/${this.name}.json`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.wearable = data.isWearable;
        this.maxStack = data.stackable;
      });
    stage.addChild(this.sprite);
  }

  destory() {
    this.sprite.destroy();
  }
}
