'use strict';

// DEPENDENCIES AND IMPORTS

const Compositor = require('./helpers/Compositor');
const Timer = require('./helpers/Timer');
const { loadLevel } = require('./helpers/loaders.js');
const { createHero } = require('./helpers/entities');
const Keyboard = require('./helpers/KeyboardState');
const { Vec2 } = require('./helpers/math');
const { loadBackgroundSprites, loadStatic } = require('./helpers/sprites');

const SpritesJS = require('./helpers/sprites.js');

const heroSize = SpritesJS.spriteSize;

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

    collisionDetect(hero, obstacles, heroSize, deltaTime);
    //console.log(obstacles[0][2]); //  obstacles.forEach(rect => {
    //  if (hero.pos[1] + heroSize.height > rect[2]) {
    // hero.pos[1] = rect[2];
    // console.log()
    // } else {
    //  }
    //   });
  };

  timer.start();

  var collisionDirection = 'NONE';

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
          collisionDirection = 'BOTTOM';
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
          collisionDirection = 'RIGHT';
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
          collisionDirection = 'LEFT';
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
      collisionDirection = 'NONE';
    }
    if (hero.stopped === true) {
      hero.vel.set(0, 0);
    }
    hero.update(deltaTime);
  }

  function mapLevelToArray(level) {
    //x1
    //x2
    //y1
    //y2
    console.log(level);
    var obs = new Array();
    //console.log(level.backgrounds.length);
    for (var i = 0; i < level.backgrounds.length; i++) {
      //console.log(level.backgrounds[i].ranges);
      level.backgrounds[i].ranges.forEach(lvl => {
        //console.log(lvl);
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
  var grapplePos = new Vec2(0, 0);
  window.addEventListener('mousedown', event => {
    const click = getMousePos(canvas, event);
    //console.log(level.backgrounds);
    //hero.pos.set(click.x, click.y);
    //hero.vel.set(click.x - hero.pos.x, click.y - hero.pos.y);

    //context.moveTo(hero.pos[0], hero.pos[1]);
    // context.moveTo(0, 0);
    // context.lineTo(click.x, click.y);
    // context.stroke();
    // context.fillRect(click.x, click.y, 100, 100);
    // const hitTerrain = false;
    //console.log(click.x + ' ' + click.y);
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

  canvas.addEventListener('mouseup', ({ offsetX, offsetY }) => {
    hero.grapple = false;
    hero.stopped = false;
    collisionDirection = 'NONE';
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
