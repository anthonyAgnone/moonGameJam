"use strict";

// DEPENDENCIES AND IMPORTS

const Compositor = require("./helpers/Compositor");
const Timer = require("./helpers/Timer");
const { loadLevel } = require("./helpers/loaders.js");
const { createHero } = require("./helpers/entities");
const Keyboard = require("./helpers/KeyboardState");
const Camera = require("./helpers/Camera");

const { loadBackgroundSprites, loadStatic } = require("./helpers/sprites");

const SpritesJS = require("./helpers/sprites.js");

const heroSize = SpritesJS.spriteSize;

const {
  createBackgroundLayer,
  createStaticLayer,
  createSpriteLayer,
  createCameraLayer
} = require("./helpers/layers");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x:
      ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width +
      camera.pos.x,
    y:
      ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height -
      camera.pos.y
  };
}

// PROMISE ALL PERFORMS FOUR FUNCTIONS AND UPON SUCCESS THE DOT THEN HAPPENS WITH THOSE RESULTS

Promise.all([
  createHero(136, 138),
  loadBackgroundSprites(),
  loadStatic(),
  loadLevel("1-1")
]).then(([hero, sprites, staticLayerSprite, level]) => {
  const comp = new Compositor();
  const camera = new Camera();
  window.camera = camera;
  const gravity = 20;

  hero.pos.set(0, 340);
  hero.lastPos.set(0, 340);
  hero.vel.set(0, 0);

  const staticLayer = createStaticLayer(staticLayerSprite, camera);
  comp.layers.push(staticLayer);

  const backgroundLayer = createBackgroundLayer(
    level.backgrounds,
    sprites,
    camera
  );
  comp.layers.push(backgroundLayer);

  const heroLayer = createSpriteLayer(hero);
  comp.layers.push(heroLayer);

  comp.layers.push(createCameraLayer(camera));

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    comp.draw(context, camera);
    camera.setPosition(hero.pos.x / 2, camera.pos.y);
    collisionDetect(hero, obstacles, heroSize, deltaTime);
    context.strokeStyle = "red";
    context.beginPath();
    context.rect(
      hero.pos.x - camera.pos.x,
      hero.pos.y - camera.pos.y,
      hero.width,
      hero.height
    );
    context.stroke();
  };

  timer.start();

  var collisionDirection = "NONE";

  function collisionDetect(hero, obs, heroSize, deltaTime) {
    const leeway = 5;
    var collision = false;
    obs.forEach(obstacles => {
      if (
        hero.pos.y + heroSize.height > obstacles[2] + leeway &&
        hero.pos.y < obstacles[3] - leeway &&
        hero.pos.x < obstacles[1] - leeway &&
        hero.pos.x + heroSize.width > obstacles[0] + leeway
      ) {
        collision = true;
        // we have hit a platform, but from what direction
        if (
          hero.pos.y + heroSize.height > obstacles[2] + leeway &&
          hero.pos.y < obstacles[2] + leeway &&
          hero.pos.x < obstacles[1] - leeway &&
          hero.pos.x + heroSize.width > obstacles[0] + leeway
        ) {
          collisionDirection = "TOP";
          if (hero.grapple === true) {
            hero.stopped = true;
          }
          hero.pos.y = obstacles[2] - heroSize.height;
        } else if (
          hero.pos.y < obstacles[3] - leeway &&
          hero.pos.y + heroSize.height > obstacles[3] - leeway &&
          hero.pos.x < obstacles[1] - leeway &&
          hero.pos.x + heroSize.width > obstacles[0] + leeway
        ) {
          collisionDirection = "BOTTOM";
          if (hero.grapple === true) {
            hero.stopped = true;
          }
          hero.pos.y = obstacles[3];
          if (hero.pos.x < obstacles[0] - heroSize.width / 2) {
            hero.pos.x = obstacles[0] - heroSize.width / 2;
          } else if (
            hero.pos.x + heroSize.width >
            obstacles[1] + heroSize.width / 2
          ) {
            hero.pos.x = obstacles[1] - heroSize.width / 2;
          }
        } else if (
          hero.pos.y < obstacles[3] - leeway &&
          hero.pos.y + heroSize.height > obstacles[2] + leeway &&
          hero.pos.x < obstacles[1] - leeway &&
          hero.pos.x + heroSize.width > obstacles[1] - leeway
        ) {
          collisionDirection = "RIGHT";
          if (hero.grapple === true) {
            hero.stopped = true;
          }
          hero.pos.x = obstacles[1] - leeway;
        } else if (
          hero.pos.y < obstacles[3] - leeway &&
          hero.pos.y + heroSize.height > obstacles[2] + leeway &&
          hero.pos.x < obstacles[0] + leeway &&
          hero.pos.x + heroSize.width > obstacles[0] + leeway
        ) {
          collisionDirection = "LEFT";
          if (hero.grapple === true) {
            hero.stopped = true;
          }
          hero.pos.x = obstacles[0] - heroSize.width + leeway;
        }
      }
    });
    if (collision === false) {
      if (hero.grapple === false) {
        hero.vel.y += gravity;
      }
      collisionDirection = "NONE";
    }
    if (hero.stopped === true) {
      hero.vel.set(0, 0);
    }
    hero.update(deltaTime);
  }

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

  var grapple = false;
  const obstacles = mapLevelToArray(level);
  // input listeners
  const input = new Keyboard();

  input.listenTo(window);
  window.addEventListener("mousedown", event => {
    const click = getMousePos(canvas, event);
    obstacles.forEach(rect => {
      if (
        click.x < rect[1] &&
        click.x > rect[0] &&
        click.y < rect[3] &&
        click.y > rect[2]
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
    });
  });

  canvas.addEventListener("mouseup", ({ offsetX, offsetY }) => {
    hero.grapple = false;
    hero.stopped = false;
    collisionDirection = "NONE";
  });
  function overlap(subject, rect) {
    return (
      subject.pos.y + heroSize.height > rect[2] &&
      subject.pos.y < rect[3] &&
      subject.pos.x > rect[0] &&
      subject.pos.x + heroSize.width < rect[1]
    );
  }

  /* Iterate over all obstables that overlap subject. */
  function intersection(subject, fn) {
    obstacles.filter(obstacle => overlap(subject, obstacle)).forEach(fn);
  }

  input.addMapping(68, keyState => {
    if (keyState > 0) hero.vel.set(150, hero.vel.y);
    else hero.vel.set(0, hero.vel.y);
  });

  input.addMapping(65, keyState => {
    if (keyState > 0) hero.vel.set(-150, hero.vel.y);
    else hero.vel.set(0, hero.vel.y);
  });

  input.addMapping(32, keyState => {
    if (keyState > 0 && !hero.isFlying) hero.vel.set(hero.vel.x, -500);
    else {
      hero.vel.set(hero.vel.x, gravity);
    }
  });

  input.addMapping(27, keyState => {
    timer.pause();
    let currentPosition = hero.pos;
    let currentVelocity = hero.vel;
    hero.pausedPos.set(currentPosition.x, currentPosition.y);
    hero.pausedVel.set(currentVelocity.x, currentVelocity.y);
  });

  input.addMapping(83, keyState => {
    hero.pos.set(hero.pausedPos.x, hero.pausedPos.y);
    hero.vel.set(hero.pausedVel.x, hero.pausedVel.y);
    timer.start();
  });
});
