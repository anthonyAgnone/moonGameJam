'use strict';

// DEPENDENCIES AND IMPORTS

const Compositor = require('./helpers/Compositor');
const Timer = require('./helpers/Timer');
const { loadLevel } = require('./helpers/loaders.js');
const { createHero, createProj } = require('./helpers/entities');
const Keyboard = require('./helpers/KeyboardState');
const Camera = require('./helpers/Camera');
const { getMousePos } = require('./helpers/mousePos');
const {
  setInitialPosition,
  addKeyMapping
} = require('./helpers/helperFunctions');
const { collisionDetect } = require('./helpers/collisionDetect');

const {
  loadBackgroundSprites,
  loadStatic,
  loadProjectileSprites
} = require('./helpers/sprites');

const SpritesJS = require('./helpers/sprites.js');
const { Vec2 } = require('./helpers/math');
const heroSize = SpritesJS.spriteSize;

const {
  createBackgroundLayer,
  createStaticLayer,
  createSpriteLayer,
  createCameraLayer
} = require('./helpers/layers');

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

var mysound = new Audio('./snd/Strange_Stuff.mp3');
mysound.loop = true;
mysound.play();

// PROMISE ALL PERFORMS FOUR FUNCTIONS AND UPON SUCCESS THE DOT THEN HAPPENS WITH THOSE RESULTS

Promise.all([
  createHero(136, 138),
  loadBackgroundSprites(),
  loadStatic(),
  loadLevel('1-1'),
  loadProjectileSprites()
]).then(([hero, sprites, staticLayerSprite, level, projSprites]) => {
  // initial globals
  const comp = new Compositor();
  const camera = new Camera();
  window.camera = camera;
  const gravity = 20;
  const timer = new Timer(1 / 60);

  setInitialPosition(hero, 800, 0);

  //create Layers

  function mapLevelToArray(level) {
    var obs = new Array();
    for (var i = 0; i < level.backgrounds.length; i++) {
      level.backgrounds[i].ranges.forEach(lvl => {
        obs.push(
          lvl.map(function(tmp) {
            return tmp * 16;
          })
        );
      });
    }

    return obs;
  }

  const obstacles = mapLevelToArray(level);

  const staticLayer = createStaticLayer(staticLayerSprite, camera);
  comp.layers.push(staticLayer);

  const backgroundLayer = createBackgroundLayer(
    level.backgrounds,
    sprites,
    camera
  );
  comp.layers.push(backgroundLayer);

  const heroLayer = createSpriteLayer(hero, projSprites);
  comp.layers.push(heroLayer);

  comp.layers.push(createCameraLayer(camera));

  //timer update functions

  timer.update = function update(deltaTime) {
    comp.draw(context, camera);
    camera.setPosition(hero.pos.x / 2, camera.pos.y);

    collisionDetect(hero, obstacles, heroSize, deltaTime, gravity);
    context.strokeStyle = 'red';
    context.beginPath();

    // TODO make grappling hook ability class add to character
    // initiateGrapple(hero, context);

    if (hero.grapple === true) {
      context.moveTo(
        hero.pos.x + heroSize.width - camera.pos.x - 20,
        hero.pos.y //+ heroSize.height / 2 - camera.pos.y
      );
      context.lineTo(
        hero.grapplePos.x - camera.pos.x + 10.5,
        hero.grapplePos.y - camera.pos.y
      );
      context.lineWidth = 5;
      context.stroke();
      context.fillRect(
        hero.grapplePos.x - camera.pos.x,
        hero.grapplePos.y - camera.pos.y,
        21,
        21
      );
    }

    // projectiles
    if (hero.shooting === true) {
      hero.shootFrame += 1;
    }
    var remInd = [];
    projArr.forEach(function(proj, index) {
      // context.fillRect(
      //   proj[0] - camera.pos.x,
      //   proj[1] - camera.pos.y,
      //   proj[2],
      //   proj[3]
      // );
      projSprites.draw(
        // projSprites.tiles[projFrames[index]].name,
        //'fireball1',
        projSprites.names[projFrames[index]],
        context,
        proj[0] - camera.pos.x,
        proj[1] - camera.pos.y
      );
      proj[0] += projVecArr[index][0];
      proj[1] += projVecArr[index][1];
      if (proj[0] > hero.pos.x + 800) {
        remInd.push(index);
      }
      projFrames[index] += 1;
      if (projFrames[index] >= projSprites.names.length - 1) {
        projFrames[index] = 2;
      }
    });

    if (remInd.length > 0) {
      //   projArr.splice(remInd);
      projArr[remInd] = [];
    }
    remInd = [];
  };

  var collisionDirection = 'NONE';

  // input listeners
  const input = new Keyboard();
  input.listenTo(window);

  var projArr = new Array();
  var projVecArr = new Array();
  var projFrames = [];
  window.addEventListener('mousedown', event => {
    const click = getMousePos(canvas, event);
    if (event.button === 0) {
      obstacles.forEach(rect => {
        if (
          click.x < rect[1] &&
          click.x > rect[0] &&
          click.y < rect[3] &&
          click.y > rect[2]
        ) {
          if (
            Math.sqrt(
              Math.pow(click.x - hero.pos.x, 2) +
                Math.pow(click.y - hero.pos.y, 2)
            ) < 700
          ) {
            hero.pos.y += -20;
            hero.grapple = true;
            hero.grapplePos.x = click.x;
            hero.grapplePos.y = click.y;
            hero.vel.set(
              hero.grapplePos.x - hero.pos.x,
              hero.grapplePos.y - hero.pos.y
            );
          }
        }
      });
    } else if (event.button === 2) {
      projArr.push([
        hero.pos.x + heroSize.width - 22,
        hero.pos.y + heroSize.height / 2 - 45,
        50,
        50
      ]);
      projVecArr.push([20, 0]);
      projFrames.push(0);
      hero.shooting = true;
      hero.shootFrame = 0;
    }
  });

  window.addEventListener('mouseup', () => {
    if (event.button === 0) {
      hero.grapple = false;
      hero.stopped = false;
      collisionDirection = 'NONE';
    }
  });

  addKeyMapping(window, input, hero, gravity, timer);

  timer.start();
});
