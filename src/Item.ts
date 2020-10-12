import * as PIXI from "pixi.js";

let data: any;
let spritesheet: PIXI.LoaderResource;

export function loadItemData(): Promise<void> {
  // load item data json
  let itemData = new Promise(async (resolve) => {
    data = await (await fetch("./items/data.json")).json();
    resolve();
  });

  // load item texture spritesheet
  let itemTextures = new Promise(async (resolve) => {
    let loader = new PIXI.Loader();
    loader.add("./items/items.json");
    await new Promise((resolve) => loader.load(resolve));
    spritesheet = loader.resources["./items/items.json"];
    resolve();
  });

  // return a promis that resolves once all promises defined above are resolved
  return new Promise((resolve) =>
    Promise.all([itemData, itemTextures]).then(() => resolve())
  );
}

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
  _count = 0;
  countString: PIXI.Text;
  stage: PIXI.Container;
  container: PIXI.Container;
  sprite: PIXI.Sprite;
  wearable = false;
  maxStack = 0;
  value = 0;
  conditionEnabled = false;
  condition = 100;

  constructor(stage: PIXI.Container, name: string, amount = 1) {
    this.name = name;
    this.container = stage;
    this.stage = new PIXI.Container();
    stage.addChild(this.stage);

    // empty background texture to define borders of container
    const bg = new PIXI.Sprite(PIXI.Texture.EMPTY);
    bg.width = baseSize;
    bg.height = baseSize;
    this.stage.addChild(bg);

    // item texture
    this.sprite = new PIXI.Sprite(spritesheet.textures![`${this.name}.png`]);
    this.sprite.x = 10;
    this.sprite.y = 6;
    this.sprite.width = this.sprite.height = baseSize - 20;
    this.stage.addChild(this.sprite);

    // item count display
    this.countString = new PIXI.Text("");
    this.countString.anchor.set(1);
    this.countString.x = baseSize - 8;
    this.countString.y = baseSize - 5;
    this.countString.style = textCountStyle;
    this.stage.addChild(this.countString);
    this.count = amount;

    // json data
    const itemData = data[this.name];
    this.wearable = itemData.isWearable;
    this.maxStack = itemData.stackable;
    this.conditionEnabled = itemData.condition.enabled;
    this.value = itemData.value;
    if (this.conditionEnabled) {
      const g = new PIXI.Graphics();
      g.beginFill(0xadcb75);
      g.drawRect(3, 3, 6, 84);
      g.endFill();
      this.stage.addChild(g);
    }

    this.count = Math.min(this.maxStack, this.count);
  }

  // getters and setters for item count
  public set count(v: number) {
    this._count = v;
    this.countString.text = "";

    if (v > 1) {
      this.countString.text = `x${this._count.toLocaleString("en")}`;
    }
  }

  public get count(): number {
    return this._count;
  }

  // try to stack a given item onto this item
  // return what is left over
  merge(item: Item): Item | void {
    if (item.name != this.name) return item;

    let room = this.maxStack - this.count;

    if (!room) return item;

    if (room >= item.count) {
      this.count += item.count;
      item.destory();
      return;
    } else {
      this.count = this.maxStack;
      item.count -= room;
      return item;
    }
  }

  copy(): Item {
    return new Item(this.container, this.name, this.count);
  }

  destory() {
    this.stage.destroy({
      children: true,
    });
  }
}
