'use strict';

// DEPENDENCIES AND IMPORTS
const Compositor = require('./helpers/Compositor');
const Timer = require('./helpers/Timer');
const { loadLevel } = require('./helpers/loaders.js');
const { createHero } = require('./helpers/entities');

const { loadBackgroundSprites, loadStatic } = require('./helpers/sprites');
const Keyboard = require('./helpers/KeyboardState.js');

const {
  createBackgroundLayer,
  createStaticLayer,
  createSpriteLayer
} = require('./helpers/layers');

const Entity = require('./helpers/Entity');

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

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
  loadLevel('1-1')
]).then(([hero, sprites, staticLayerSprite, level]) => {
  const comp = new Compositor();

  const gravity = 30;

  hero.pos.set(50, 900);
  hero.vel.set(200, -200);

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

  input.addMapping(32, keyState => {
    console.log(keyState);
  });
  input.listenTo(window);

  window.addEventListener('mousedown', event => {
    const click = getMousePos(canvas, event);
    console.log(level.backgrounds);
    hero.pos.set(click.x, click.y);
    hero.vel.set(200, -200);

    //context.moveTo(hero.pos[0], hero.pos[1]);
    // context.moveTo(0, 0);
    // context.lineTo(click.x, click.y);
    // context.stroke();
    // context.fillRect(click.x, click.y, 100, 100);
    // const hitTerrain = false;
    // obstacles.forEach(rect => {
    //   if (
    //     offsetX < rect.r &&
    //     offsetX > rect.l &&
    //     offsetY < rect.b &&
    //     offsetY > rect.t
    //   ) {
    //     grapple = true;
    //     desired.x = offsetX;
    //     desired.y = offsetY;
    //   }
    // });
  });

  canvas.addEventListener('mouseup', ({ offsetX, offsetY }) => {
    // grapple = false;
    // followers[0].stopped = false;
    // followers[0].stopping = false;
  });
});
