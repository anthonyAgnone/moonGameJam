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
  loadMageSprites,
  loadGrappleSpritesRight,
  loadGrappleSpritesLeft,
  loadMageProjectileSprites
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
//mysound.play();

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
  loadMageSprites(),
  loadGrappleSpritesRight(),
  loadGrappleSpritesLeft(),
  loadMageProjectileSprites()
]).then(
  ([
    hero,
    sprites,
    staticLayerSprite,
    scrollingSprite,
    level,
    projSprites,
    gumSprites,
    mageSprites,
    grappleSpritesRight,
    grappleSpritesLeft,
    mageProjSprites
  ]) => {
    // initial globals
    const comp = new Compositor();
    const camera = new Camera();
    window.camera = camera;
    const gravity = 30;
    const timer = new Timer(1 / 60);

    setInitialPosition(hero, 0, 400);

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

    let grappleReturnRight = 0;
    let grappleReturnLeft = 0;

    const grappleRightArray = [];
    const grappleLeftArray = [];

    grappleSpritesRight.names.forEach((name, i) => {
      for (let j = 0; j < 9; j++) {
        grappleRightArray.push(name);
      }
    });

    grappleSpritesLeft.names.forEach((name, i) => {
      for (let j = 0; j < 9; j++) {
        grappleLeftArray.push(name);
      }
    });

    let isMouseDown = false;

    //timer update functions

    var randCount = 0;
    var randmCount = 0;
    var randX = 0;
    var mageProjArr = [];
    var mageProjVecArr = [];
    var mageProjFrames = [];
    var mageProjOrig = [];
    var mageProjInd = [];
    timer.update = function update(deltaTime) {
      comp.draw(context, camera);
      camera.setPosition(hero.pos.x * 0.8, hero.pos.y * 0.05);
      if (camera.pos.x < 0) camera.pos.x = 0;
      collisionDetect(hero, obstacles, heroSize, deltaTime, gravity);
      context.strokeStyle = 'red';
      context.beginPath();

      //fire grappling particle effect
      //console.log(isMouseDown);
      if (isMouseDown) {
        let particlePosition = new Vec2(0, 0);
        if (hero.grapple) {
          if (hero.facingLeft)
            particlePosition.set(
              hero.pos.x - camera.pos.x - 20,
              hero.pos.y - camera.pos.y - 20
            );
          else
            particlePosition.set(
              hero.pos.x + heroSize.width / 2 - camera.pos.x + 40,
              hero.pos.y - camera.pos.y - 40
            );
        } else {
          if (hero.facingLeft)
            particlePosition.set(
              hero.pos.x - camera.pos.x - 40,
              hero.pos.y - camera.pos.y + hero.height / 2
            );
          else
            particlePosition.set(
              hero.pos.x + heroSize.width / 2 - camera.pos.x + 40,
              hero.pos.y - camera.pos.y + hero.height / 2
            );
        }

        if (!hero.facingLeft) {
          grappleSpritesRight.draw(
            grappleRightArray[grappleReturnRight],
            context,
            particlePosition.x,
            particlePosition.y
          );
        } else {
          grappleSpritesLeft.draw(
            grappleLeftArray[grappleReturnLeft],
            context,
            particlePosition.x,
            particlePosition.y
          );
        }
      }

      // TODO make grappling hook ability class add to character
      // initiateGrapple(hero, context);

      if (hero.grapple === true) {
        if (hero.facingLeft) {
          context.moveTo(
            hero.pos.x - camera.pos.x + 20,
            hero.pos.y - camera.pos.y + 20
          );
        } else {
          context.moveTo(
            hero.pos.x + heroSize.width - camera.pos.x - 10,
            hero.pos.y - camera.pos.y - 20
          );
        }

        if (grappleReturnLeft < grappleLeftArray.length - 2)
          grappleReturnLeft += 1;
        if (grappleReturnRight < grappleRightArray.length - 2)
          grappleReturnRight += 1;

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
      const rando = Math.round(Math.random() * (100 - 100) + 100);
      randmCount += 1;
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
          gumSprites.draw(
            gumSprites.names[enemFrames[index]],
            context,
            enem[0] - camera.pos.x,
            enem[1] - camera.pos.y - 20
          );
        } else if (enemType[index] === 'moon2MAGE') {
          // console.log(index + ' ' + randmCount + ' ' + rando);
          if (randmCount >= 50) {
            if (Math.random() > 0.75) {
              mageProjArr.push([enem[0], enem[1], 50, 50]);
              mageProjVecArr.push([
                (hero.pos.x - enem[0]) / 200,
                (hero.pos.y - enem[1]) / 200
              ]);
              mageProjInd.push(index);
              // console.log([enemiesOrig[index][0], enemiesOrig[index][1]]);
              mageProjOrig.push([enemiesOrig[index][0], enemiesOrig[index][1]]);
              // console.log(mageProjOrig);
              if (hero.pos.x - enem[0] < 0) {
                mageProjFrames.push(8);
              } else {
                mageProjFrames.push(0);
              }
            }

            randX = Math.random() * (10 - -10) + -10;
            if (randmCount == 51) {
              randmCount = 0;
            }

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
          //  console
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
      // console.log(mageProjArr);
      var remmInd = [];
      if (mageProjArr.length > 0) {
        mageProjArr.forEach(function(mproj, mindex) {
          // console.log(mproj);
          // console.log(projSprites.names[mageProjFrames[mindex]]);
          mageProjSprites.draw(
            mageProjSprites.names[mageProjFrames[mindex]],
            context,
            mproj[0] - camera.pos.x,
            mproj[1] - camera.pos.y
          );
          mproj[0] += mageProjVecArr[mindex][0];
          mproj[1] += mageProjVecArr[mindex][1];
          // if (mproj[0] > hero.pos.x + 800) {
          //   remInd.push(index);
          // }

          mageProjFrames[mindex] += 1;
          if (mageProjFrames[mindex] == 5) {
            mageProjFrames[mindex] = 2;
          } else if (mageProjFrames[mindex] == 11) {
            mageProjFrames[mindex] = 8;
          }
          //console.log(Math.abs(mproj[1] - mageProjOrig[mindex][1]));
          if (
            Math.abs(mproj[0] - mageProjOrig[mindex][0]) > 500 ||
            Math.abs(mproj[1] - mageProjOrig[mindex][1]) > 500
          ) {
            remmInd.push(mindex);
          }

          // hit detect on player

          // console.log(
          //   (mproj[1] + 43 > hero.pos.y) +
          //     ' ' +
          //     (mproj[1] < hero.pos.y) +
          //     ' ' +
          //     (mproj[0] < hero.pos.x + heroSize.width) +
          //     ' ' +
          //     (mproj[0] + 88 > hero.pos.x)
          // );
          if (
            mproj[1] + 43 + camera.pos.y > hero.pos.y &&
            mproj[1] < hero.pos.y &&
            mproj[0] < hero.pos.x + heroSize.width &&
            mproj[0] + 88 > hero.pos.x
          ) {
            //enemFrames[eIndex] = 4;
            // projFrames[index] = 5;
            // remIndEnemy.push(eIndex);
            //remInd.push(index);
            console.log('HHIITT');
          }
        });
        if (remmInd.length > 0) {
          //   projArr.splice(remInd);
          //projArr[remInd] = [];
          var count = 0;
          for (var i = 0; i < remmInd.length; i++) {
            mageProjArr.splice(remmInd[(i -= count)], 1);
            mageProjFrames.splice(remmInd[(i -= count)], 1);
            mageProjVecArr.splice(remmInd[(i -= count)], 1);
            mageProjOrig.splice(remmInd[(i -= count)], 1);
            // enemies.splice(mageProjInd[remmInd[(i -= count)]], 1);
            mageProjInd.splice(remmInd[(i -= count)], 1);
            count += 1;
          }
          remmInd = [];
        }
        // console.log(mageProjArr + ' ' + mageProjOrig);
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

          const leeway = 0;
          enemies.forEach(function(obst, eIndex) {
            var w = 0;
            var h = 0;
            if (enemType[eIndex] == 'moon2GUM') {
              w = 200;
              h = 150;
            } else if (enemType[eIndex] == 'moon2MAGE') {
              w = 100;
              h = 250;
            }
            var obstarr = [obst[0], obst[0] + w, obst[1], obst[1] + h];
            if (
              proj[1] + 43 > obstarr[2] + leeway - camera.pos.y &&
              proj[1] < obstarr[3] - leeway - camera.pos.y &&
              proj[0] < obstarr[1] - leeway &&
              proj[0] + 88 > obstarr[0] + leeway
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
              enemiesOrig.splice(remIndEnemy[(i -= count)], 1);
              count += 1;
            }
          }, 75);
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
      if (event.shiftKey) {
        hero.pos.x = click.x;
        hero.pos.y = click.y;
      }
      click.y += camera.pos.y + 30;
      if (event.button === 0) {
        isMouseDown = true;
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
                hero.grapplePos.x - hero.pos.x + 200,
                hero.grapplePos.y - hero.pos.y - 200
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
        grappleReturnLeft = 0;
        grappleReturnRight = 0;
        isMouseDown = false;
      }
    });

    addKeyMapping(window, input, hero, gravity, timer);

    timer.start();
  }
);
