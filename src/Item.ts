import * as PIXI from "pixi.js";

const baseSize = 90;

const textCountStyle = new PIXI.TextStyle({
  fontFamily: "Roboto Condensed",
  fontWeight: "700",
  fill: 0xd3d3d3,
  fontSize: 18,
  letterSpacing: 0.9,
});

export class Item {
  name: string;
  amount = 0;
  amountString: PIXI.Text;
  stage: PIXI.Container;
  sprite: PIXI.Sprite;
  wearable = false;
  maxStack = 0;

  constructor(stage: PIXI.Container, name: string, amount: number) {
    this.name = name;
    this.stage = new PIXI.Container();
    stage.addChild(this.stage);

    // empty background texture to define borders of container
    const bg = new PIXI.Sprite(PIXI.Texture.EMPTY);
    bg.width = baseSize;
    bg.height = baseSize;
    this.stage.addChild(bg);

    // item texture
    // TODO: have a central bank of textures
    this.sprite = new PIXI.Sprite(
      PIXI.Texture.from(`./items/${this.name}.png`)
    );
    this.sprite.x = 10;
    this.sprite.y = 6;
    this.sprite.width = this.sprite.height = baseSize - 20;
    this.stage.addChild(this.sprite);

    // item count display
    this.amountString = new PIXI.Text("");
    this.amountString.anchor.set(1);
    this.amountString.x = baseSize - 8;
    this.amountString.y = baseSize - 5;
    this.amountString.style = textCountStyle;
    this.stage.addChild(this.amountString);
    this.count = amount;

    // json data
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
  }

  // getters and setters for item count
  public set count(v: number) {
    this.amount = v;

    if (v > 1) {
      this.amountString.text = `x${this.amount.toLocaleString("en")}`;
    }
  }

  public get count(): number {
    return this.amount;
  }

  destory() {
    this.stage.destroy({
      children: true,
    });
  }
}
