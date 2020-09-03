import * as PIXI from "pixi.js";

const padding = 6;
const baseSize = 90;

export class Item {
  name: string;
  amount: number;
  stage: PIXI.Container;
  sprite: PIXI.Sprite;
  wearable = false;
  maxStack = 0;

  constructor(stage: PIXI.Container, name: string, amount: number) {
    this.name = name;
    this.amount = amount;
    this.stage = new PIXI.Container();

    const bg = new PIXI.Sprite(PIXI.Texture.EMPTY);
    bg.width = baseSize;
    bg.height = baseSize;
    this.stage.addChild(bg);

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
      })
      .catch((err) => {
        console.log(this.name);
        console.log(err);
      });
    this.sprite.x = padding;
    this.sprite.y = padding;
    this.sprite.width = baseSize - padding * 2;
    this.sprite.height = baseSize - padding * 2;
    this.stage.addChild(this.sprite);
    stage.addChild(this.stage);
  }

  destory() {
    this.sprite.destroy();
  }
}
