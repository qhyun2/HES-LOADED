const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

// Rectangle
graphics.beginFill(0x32A3F2);
graphics.drawRect(50, 50, 100, 100);
graphics.endFill();
app.stage.addChild(graphics);