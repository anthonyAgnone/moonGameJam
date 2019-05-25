"use strict";

// DEPENDENCIES AND IMPORTS
const Compositor = require("./helpers/Compositor");
const Timer = require("./helpers/Timer");
const { loadLevel } = require("./helpers/loaders.js");
const { createHero } = require("./helpers/entities");
const Keyboard = require("./helpers/KeyboardState");

const { loadBackgroundSprites, loadStatic } = require("./helpers/sprites");

const {
  createBackgroundLayer,
  createStaticLayer,
  createSpriteLayer
} = require("./helpers/layers");

const Entity = require("./helpers/Entity");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
  };
}

// PROMISE ALL PERFORMS FOUR FUNCTIONS AND UPON SUCCESS THE DOT THEN HAPPENS WITH THOSE RESULTS

Promise.all([
  createHero(),
  loadBackgroundSprites(),
  loadStatic(),
  loadLevel("1-1")
]).then(([hero, sprites, staticLayerSprite, level]) => {
  const comp = new Compositor();

  const gravity = 20;

  hero.pos.set(50, 90);
  hero.lastPos.set(50, 90);
  hero.vel.set(0, 0);

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

  // input listeners
  const input = new Keyboard();

  input.listenTo(window);

  input.addMapping(68, keyState => {
    if (keyState > 0) hero.vel.set(300, hero.vel.y);
    else hero.vel.set(0, hero.vel.y);
  });

  input.addMapping(65, keyState => {
    if (keyState > 0) hero.vel.set(-300, hero.vel.y);
    else hero.vel.set(0, hero.vel.y);
  });

  input.addMapping(32, keyState => {
    if (keyState > 0) hero.vel.set(hero.vel.x, -500);
    else {
      hero.vel.set(hero.vel.x, gravity);
    }
  });
});
