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
const { collisionDetectProj } = require('./helpers/collisionDetectProj');

const {
  loadBackgroundSprites,
  loadStatic,
  loadProjectileSprites,
  loadScrolling,
  loadLevelBlocks,
  loadGumSprites,
  loadMageSprites
} = require('./helpers/sprites');

const SpritesJS = require('./helpers/sprites.js');
const { Vec2 } = require('./helpers/math');
const heroSize = SpritesJS.spriteSize;

const {
  createBackgroundLayer,
  createStaticLayer,
  createScrollingLayer,
  createSpriteLayer,
  createCameraLayer
} = require('./helpers/layers');

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

var mysound = new Audio('./snd/Strange_Stuff.mp3');
mysound.loop = true;
mysound.play();

let currentLevel = '1-1';

// PROMISE ALL PERFORMS FOUR FUNCTIONS AND UPON SUCCESS THE DOT THEN HAPPENS WITH THOSE RESULTS

Promise.all([
  createHero(136, 138),
  loadLevelBlocks(),
  loadStatic(),
  loadScrolling(),
  loadLevel(currentLevel),
  loadProjectileSprites(),
  loadGumSprites(),
  loadMageSprites()
]).then(
  ([
    hero,
    sprites,
    staticLayerSprite,
    scrollingSprite,
    level,
    projSprites,
    gumSprites,
    mageSprites
  ]) => {
    // initial globals
    const comp = new Compositor();
    const camera = new Camera();
    window.camera = camera;
    const gravity = 30;
    const timer = new Timer(1 / 60);

    setInitialPosition(hero, 100, 500);

    //create Layers

    function mapLevelToArray(level) {
      var obs = new Array();
      for (var i = 0; i < level.backgrounds.length; i++) {
        const size = level.backgrounds[i].size;
        level.backgrounds[i].ranges.forEach(lvl => {
          obs.push(
            lvl.map(function(tmp) {
              return tmp * size;
            })
          );
        });
      }

      return obs;
    }
    function mapEnemiesToArray(level) {
      var enem = new Array();
      var enemType = new Array();
      var enemFrames = new Array();
      for (var i = 0; i < level.enemies.length; i++) {
        const size = level.enemies[i].size;
        level.enemies[i].ranges.forEach(lvl => {
          enemType.push(level.enemies[i].tile);
          enemFrames.push(0);
          enem.push(
            lvl.map(function(tmp) {
              return tmp * size;
            })
          );
        });
      }
      return [enem, enemType, enemFrames];
    }

    const obstacles = mapLevelToArray(level);
    const enemArr = mapEnemiesToArray(level);
    var enemies = enemArr[0];
    const enemiesOrig = JSON.parse(JSON.stringify(enemies));
    var enemType = enemArr[1];
    var enemFrames = enemArr[2];

    // console.log(level);

    const staticLayer = createStaticLayer(staticLayerSprite, camera);
    comp.layers.push(staticLayer);

    const scrollingLayer = createScrollingLayer(scrollingSprite, camera);
    comp.layers.push(scrollingLayer);

    const backgroundLayer = createBackgroundLayer(
      level.backgrounds,
      sprites,
      camera
    );
    comp.layers.push(backgroundLayer);

    const heroLayer = createSpriteLayer(
      hero,
      projSprites,
      gumSprites,
      mageSprites
    );
    comp.layers.push(heroLayer);

    comp.layers.push(createCameraLayer(camera));

    //timer update functions

    var randCount = 0;
    var randX = 0;
    timer.update = function update(deltaTime) {
      comp.draw(context, camera);
      camera.setPosition(hero.pos.x * 0.8, hero.pos.y * 0.05);

      collisionDetect(hero, obstacles, heroSize, deltaTime, gravity);
      context.strokeStyle = 'red';
      context.beginPath();

      // TODO make grappling hook ability class add to character
      // initiateGrapple(hero, context);

      if (hero.grapple === true) {
        context.moveTo(
          hero.pos.x + heroSize.width - camera.pos.x - 20,
          hero.pos.y + heroSize.height / 2 - camera.pos.y
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
      // enemies
      enemies.forEach(function(enem, index) {
        var tmpa = 0;
        if (enemType[index] === 'moon2GUM') {
          //  tmpa = Math.floor(enemFrames[index] / 11);

          randCount += 1;
          if (randCount == 25) {
            randX = Math.random() * (10 - -10) + -10;
            randCount = 0;

            //console.log(enem[0] + ' ' + enemiesOrig[index][0]);
            if (
              enem[0] + randX > enemiesOrig[index][0] - 100 &&
              enem[0] + randX < enemiesOrig[index][0] + 100
            ) {
              enem[0] += randX;
              if (randX < 0 && enemFrames[index] < 2) {
                enemFrames[index] += 2;
              } else if (randX > 0 && enemFrames[index] >= 2) {
                enemFrames[index] -= 2;
              }
            }

            enemFrames[index] += 1;
            if (enemFrames[index] == 2) {
              enemFrames[index] = 0;
            } else if (enemFrames[index] == 4) {
              enemFrames[index] = 2;
            }
          }
          //  console.log(enem);
          if (enemType[index] === 'moon2GUM') {
            gumSprites.draw(
              gumSprites.names[enemFrames[index]],
              context,
              enem[0] - camera.pos.x,
              enem[1] - camera.pos.y - 20
            );
          }
        } else if (enemType[index] === 'moon2MAGE') {
          randCount += 1;
          if (randCount == 25) {
            randX = Math.random() * (10 - -10) + -10;
            randCount = 0;

            //console.log(enem[0] + ' ' + enemiesOrig[index][0]);
            if (
              enem[0] + randX > enemiesOrig[index][0] - 100 &&
              enem[0] + randX < enemiesOrig[index][0] + 100
            ) {
              enem[0] += randX;
              if (randX < 0 && enemFrames[index] < 1) {
                enemFrames[index] += 1;
              } else if (randX > 0 && enemFrames[index] >= 1) {
                enemFrames[index] -= 1;
              }
            }

            enemFrames[index] += 1;
            if (enemFrames[index] == 1) {
              enemFrames[index] = 0;
            } else if (enemFrames[index] == 2) {
              enemFrames[index] = 1;
            }
          }
          //  console.log(enem);
          if (enemType[index] === 'moon2GUM') {
            gumSprites.draw(
              gumSprites.names[enemFrames[index]],
              context,
              enem[0] - camera.pos.x,
              enem[1] - camera.pos.y - 20
            );
          }
          mageSprites.draw(
            mageSprites.names[enemFrames[index]],
            context,
            enem[0] - camera.pos.x,
            enem[1] - camera.pos.y - 20
          );
        }
      });

      // projectiles
      if (hero.shooting === true) {
        hero.shootFrame += 1;
      }
      var remInd = [];
      var remIndEnemy = [];
      if (projArr.length > 0) {
        projArr.forEach(function(proj, index) {
          projSprites.draw(
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
          if (projFrames[index] == 5) {
            projFrames[index] = 2;
          } else if (projFrames[index] == 11) {
            projFrames[index] = 8;
          }

          const leeway = 10;
          enemies.forEach(function(obst, eIndex) {
            const w = 88;
            const h = 43;
            var obstarr = [obst[0], obst[0] + w, obst[1], obst[1] + h];
            if (
              proj[1] + h > obstarr[2] + leeway - camera.pos.y &&
              proj[1] < obstarr[3] - leeway - camera.pos.y &&
              proj[0] < obstarr[1] - leeway &&
              proj[0] + w > obstarr[0] + leeway
            ) {
              enemFrames[eIndex] = 4;
              projFrames[index] = 5;
              remIndEnemy.push(eIndex);
              remInd.push(index);
            }
          });
        });

        if (remInd.length > 0) {
          //   projArr.splice(remInd);
          //projArr[remInd] = [];
          var count = 0;
          for (var i = 0; i < remInd.length; i++) {
            projArr.splice(remInd[(i -= count)], 1);
            projFrames.splice(remInd[(i -= count)], 1);
            projVecArr.splice(remInd[(i -= count)], 1);
            count += 1;
          }
        }
        if (remIndEnemy.length > 0) {
          //   projArr.splice(remInd);
          //projArr[remInd] = [];

          setTimeout(() => {
            var count = 0;
            for (var i = 0; i < remIndEnemy.length; i++) {
              enemies.splice(remIndEnemy[(i -= count)], 1);
              enemType.splice(remIndEnemy[(i -= count)], 1);
              enemFrames.splice(remIndEnemy[(i -= count)], 1);
              count += 1;
            }
          }, 100);
        }
        remInd = [];
      }
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
      click.y += camera.pos.y + 30;
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
              if (click.x >= hero.pos.x) {
                hero.facingLeft = false;
              } else {
                if (click.x < hero.pos.x) {
                  hero.facingLeft = true;
                }
              }
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
        if (click.x >= hero.pos.x) {
          hero.facingLeft = false;
          projArr.push([
            hero.pos.x + heroSize.width - 22,
            hero.pos.y + heroSize.height / 2 - 45,
            50,
            50
          ]);
          projVecArr.push([20, 0]);
          projFrames.push(0);
        } else {
          hero.facingLeft = true;
          projArr.push([
            hero.pos.x - 40,
            hero.pos.y + heroSize.height / 2 - 45,
            50,
            50
          ]);
          projVecArr.push([-20, 0]);
          projFrames.push(6);
          hero.shootingLeft = true;
        }
        hero.shootFrame = 0;
        hero.shooting = true;
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
  }
);
