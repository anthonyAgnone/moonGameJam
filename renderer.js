"use strict";

// DEPENDENCIES AND IMPORTS

const { loadLevel } = require("./helpers/loaders.js");

const {
  loadHeroIdle,
  loadBackgroundSprites,
  loadStatic
} = require("./helpers/sprites");

const Compositor = require("./helpers/Compositor");

const {
  createBackgroundLayer,
  createStaticLayer
} = require("./helpers/layers");

const Entity = require("./helpers/Entity");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function createSpriteLayer(entity) {
  return function drawSpriteLayer(context) {
    entity.draw(context);
  };
}

// PROMISE ALL PERFORMS FOUR FUNCTIONS AND UPON SUCCESS THE DOT THEN HAPPENS WITH THOSE RESULTS

Promise.all([
  loadBackgroundSprites(),
  loadHeroIdle(),
  loadStatic(),
  loadLevel("1-1")
]).then(([sprites, heroSprite, staticLayerSprite, level]) => {
  const comp = new Compositor();

  const gravity = 0.5;

  const staticLayer = createStaticLayer(staticLayerSprite);
  comp.layers.push(staticLayer);

  const backgroundLayer = createBackgroundLayer(level.backgrounds, sprites);
  comp.layers.push(backgroundLayer);

  const hero = new Entity();
  hero.pos.set(50, 900);
  hero.vel.set(2, -10);

  hero.draw = function drawHero(context) {
    heroSprite.draw("idle", context, this.pos.x, this.pos.y);
  };

  hero.update = function updateHero() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  };

  const heroLayer = createSpriteLayer(hero);
  comp.layers.push(heroLayer);

  function update() {
    comp.draw(context);
    hero.update();
    hero.vel.y += gravity;
    requestAnimationFrame(update);
  }

  update();
});
