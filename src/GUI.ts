import * as PIXI from "pixi.js";

const textButtonStyle = new PIXI.TextStyle({
  fontFamily: "Roboto Condensed",
  fontWeight: "700",
  fill: 0xa7db4d,
  fontSize: 25,
  letterSpacing: 0.9,
});

export class GUI {
  stage = new PIXI.Container();

  constructor() {
    const button = new Button("NEW LOOT", 1095, 340, 260, 40);
    this.stage.addChild(button.stage);
    button.onClick = () => {
      console.log("yo");
    };
  }
}

const BUTTON_NOISE = new PIXI.filters.NoiseFilter(0.02);
const BUTTON_DEFAULT = 0x3e5728;
const BUTTON_HIGHLIGHT = 0x3e6428;
const BUTTON_PRESSED = 0x3e7028;

export class Button {
  stage = new PIXI.Container();
  bg = new PIXI.Sprite(PIXI.Texture.WHITE);
  text = new PIXI.Text("");
  onClick: Function | undefined;

  constructor(text: string, x: number, y: number, w: number, h: number) {
    this.bg.x = x;
    this.bg.y = y;
    this.bg.width = w;
    this.bg.height = h;
    this.bg.anchor.set(0.5, 0.5);
    this.bg.tint = BUTTON_DEFAULT;
    this.bg.filters = [BUTTON_NOISE];
    this.stage.addChild(this.bg);

    this.text.x = x;
    this.text.y = y;
    this.text.anchor.set(0.5, 0.5);
    this.text.text = text;
    this.text.style = textButtonStyle;
    this.stage.addChild(this.text);

    this.stage.interactive = true;
    this.stage
      .on("mouseup", () => (this.bg.tint = BUTTON_DEFAULT))
      .on("mousedown", () => {
        this.bg.tint = BUTTON_PRESSED;
        this.onClick && this.onClick();
      })
      .on("mouseout", () => (this.bg.tint = BUTTON_DEFAULT))
      .on("mouseover", () => (this.bg.tint = BUTTON_HIGHLIGHT));
  }
}
