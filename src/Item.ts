import * as PIXI from "pixi.js";

export class Item {
  name: string;
  amount: number;
  sprite: PIXI.Sprite;

  constructor(stage: PIXI.Container, name: string, amount: number) {
    this.name = name;
    this.amount = amount;
    this.sprite = new PIXI.Sprite(
      PIXI.Texture.from(`./items/${this.name}.png`)
    );
    stage.addChild(this.sprite);
  }

  destory() {
    this.sprite.destroy();
  }
}
