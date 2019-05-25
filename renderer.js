"use strict";

// DEPENDENCIES AND IMPORTS
const Compositor = require("./helpers/Compositor");
const Timer = require("./helpers/Timer");
const { loadLevel } = require("./helpers/loaders.js");
const { createHero } = require("./helpers/entities");

const { loadBackgroundSprites, loadStatic } = require("./helpers/sprites");

const {
  createBackgroundLayer,
  createStaticLayer,
  createSpriteLayer
} = require("./helpers/layers");

const Entity = require("./helpers/Entity");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// PROMISE ALL PERFORMS FOUR FUNCTIONS AND UPON SUCCESS THE DOT THEN HAPPENS WITH THOSE RESULTS

Promise.all([
  createHero(),
  loadBackgroundSprites(),
  loadStatic(),
  loadLevel("1-1")
]).then(([hero, sprites, staticLayerSprite, level]) => {
  const comp = new Compositor();

  const gravity = 30;

  hero.pos.set(50, 900);
  hero.vel.set(200, -2000);

  const staticLayer = createStaticLayer(staticLayerSprite);
  comp.layers.push(staticLayer);

  const backgroundLayer = createBackgroundLayer(level.backgrounds, sprites);
  comp.layers.push(backgroundLayer);

  const heroLayer = createSpriteLayer(hero);
  comp.layers.push(heroLayer);

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    comp.draw(context);
    hero.update(deltaTime);
    hero.vel.y += gravity;
  };

  timer.start();
});
