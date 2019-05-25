"use strict";

const { loadImage, loadLevel } = require("../helpers/loaders");
const SpriteSheet = require("../helpers/SpriteSheet");
const {
  loadBackgroundSprite,
  loadGroundSprites,
  loadHeroSprite,
  loadHeroIdle
} = require("../helpers/sprites");

class Mario {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 1920;
    this.height = 1080;
    this.pos = {
      x: 54,
      y: 704
    };
    this.addBindings();
    this.addListeners();
    this.beforeStart();
    this.makeDrawing();
  }

  addBindings() {
    this.update = this.update.bind(this);
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
    Promise.all([
      loadHeroSprite(),
      loadGroundSprites(),
      loadBackgroundSprite(this.width, this.height),
      loadHeroIdle(),
      loadLevel("1-1")
    ]).then(([hero, ground, background, idle, level]) => {
      level.backgrounds.forEach(background => {
        this.drawBackground(background, this.ctx, ground);
      });
      background.draw("background", this.ctx, 0, 0);
      hero.draw("run", this.ctx, 4, 570);
      idle.draw("idle", scene.ctx, scene.pos.x, scene.pos.y);
      function update(scene) {
        idle.draw("idle", scene.ctx, scene.pos.x, scene.pos.y);
        scene.pos.x += 2;
        requestAnimationFrame(update);
      }
      update(this);
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

  makeDrawing() {}

  stopDrawing() {
    window.clearInterval(this.interval);
  }

  updateDrawing() {}

  draw(x, y) {}
}

module.exports = Mario;
