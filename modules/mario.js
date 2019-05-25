"use strict";

const CONSTANTS = {
  interval: 10,
  duration: 20,
  width: 5
};

const { loadImage, loadLevel } = require("../helpers/loaders");
const SpriteSheet = require("../helpers/SpriteSheet");

class Mario {
  constructor(canvas, ctx, shouldTakeScreenshots = false) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.colorSwitchCount = 0;
    this.width = null;
    this.height = null;
    this.interval = null;
    this.counter = 0;
    this.screenshot = shouldTakeScreenshots;
    this.addBindings();
    this.addListeners();
    this.update();
    this.beforeStart();
    this.makeDrawing();
  }

  addBindings() {
    this.update = this.update.bind(this);
    this.updateDrawing = this.updateDrawing.bind(this);
    this.drawBackground = this.drawBackground.bind(this);
  }

  addListeners() {
    window.addEventListener("resize", this.update);
  }

  update() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  beforeStart() {
    this.ctx.fillStyle = "#ffff00";
    this.ctx.fillRect(0, 0, this.width, this.height);
    loadImage("./img/tiles.png").then(image => {
      const sprites = new SpriteSheet(image);
      sprites.define("ground", 0, 0);
      sprites.define("sky", 3, 23);

      const level = loadLevel("1-1");
      level.backgrounds.forEach(bg => {
        this.drawBackground(bg, this.ctx, sprites);
      });
    });
  }

  drawBackground(background, ctx, sprites) {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
      for (let x = x1; x < x2; ++x) {
        for (let y = y1; y < y2; ++y) {
          sprites.drawTile(background.tile, ctx, x, y);
        }
      }
    });
  }

  makeDrawing() {
    this.interval = window.setInterval(this.updateDrawing, CONSTANTS.interval);
  }

  stopDrawing() {
    window.clearInterval(this.interval);
  }

  updateDrawing() {}

  draw(x, y) {}
}

module.exports = Mario;
