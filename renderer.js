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
const { drawOutline } = require('./helpers/drawOutline');
const { collisionDetect } = require('./helpers/collisionDetect');
const { collisionDetectProj } = require('./helpers/collisionDetectProj');
const { levelTransition } = require('./helpers/levelTransition');

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
  loadMageProjectileSprites,
  loadBOSSSprites
} = require('./helpers/sprites');

const SpritesJS = require('./helpers/sprites.js');
const { Vec2, interpolate, lerp } = require('./helpers/math');
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

let currentLevel = 'test';

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
  loadMageProjectileSprites(),
  loadBOSSSprites()
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
    mageProjSprites,
    bossSprites
  ]) => {
    // initial globals
    const comp = new Compositor();
    const camera = new Camera();
    window.camera = camera;
    const gravity = 30;
    const timer = new Timer(1 / 60);
    var moonHelmStatus = 0; //0 helm 1 head 2 bald
    var moonAttack = false;
    var moonIndex = 0;
    var attack = Math.floor(Math.round(Math.random() * (2 - 0)));
    var hurtboxHead = [];
    var hurtboxBody = [];
    var hurtboxSword = [];
    var headw = 105;
    var headh = 120;
    var bodyw = 345;
    var bodyh = 425;
    var sww = 300;
    var swh = 130;
    var moonDeath = false;
    setInitialPosition(hero, 10, 822);

    //create Layers

    function mapLevelToArray(level) {
      var obs = new Array();
      var obsDmg = new Array();
      for (var i = 0; i < level.backgrounds.length; i++) {
        const size = level.backgrounds[i].size;
        obsDmg.push(level.backgrounds[i].dmg);
        level.backgrounds[i].ranges.forEach(lvl => {
          obs.push(
            lvl.map(function(tmp) {
              return tmp * size;
            })
          );
        });
      }

      return [obs, obsDmg];
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

    const obstaclesArr = mapLevelToArray(level);
    const obstacles = obstaclesArr[0];
    const obstaclesDmg = obstaclesArr[1];

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
    var randbCount = 0;
    var randX = 0;
    var mageProjArr = [];
    var mageProjVecArr = [];
    var mageProjFrames = [];
    var mageProjOrig = [];
    var mageProjInd = [];
    let transition = false;
    let bossTransition = false;

    timer.update = function update(deltaTime) {
      comp.draw(context, camera);

      if (hero.pos.x > 6400) {
        camera.pos.x = lerp(camera.pos.x, hero.pos.x, 0.1);
        camera.pos.y = hero.pos.y * 0.3;
        transition = true;
        if (!canvas.classList.contains('shook')) {
          canvas.classList.add('shook');
        }
      } else {
        camera.setPosition(hero.pos.x * 0.8, hero.pos.y * 0.05);
      }

      if (camera.pos.x < 0) camera.pos.x = 0;

      collisionDetect(
        hero,
        obstacles,
        heroSize,
        deltaTime,
        gravity,
        obstaclesDmg
      );
      // console.log(obstaclesDmg);
      context.beginPath();
      // drawOutline(
      //   context,
      //   hero.pos.x,
      //   hero.pos.y,
      //   heroSize.width,
      //   heroSize.height,
      //   camera
      // );

      context.font = '30px Arial Bold';
      context.fillStyle = 'red';
      context.fillText('Life Remaining : ' + hero.hp, 10, 30);
      //fire grappling particle effect
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
      const randX = Math.random() * (10 - -10) + -10;
      // console.log(attack);
      randmCount += 1;
      randbCount += 1;
      enemies.forEach(function(enem, index) {
        var w = 0;
        var h = 0;
        var obstarr = [];
        if (enemType[index] == 'moon2GUM') {
          w = 200;
          h = 150;
          obstarr = [enem[0], enem[0] + w, enem[1], enem[1] + h];
        } else if (enemType[index] == 'moon2MAGE') {
          w = 180;
          h = 220;
          obstarr = [enem[0], enem[0] + w, enem[1], enem[1] + h];
          obstarr[0] += 40;
          obstarr[2] -= 10;
        } else if (enemType[index] == 'moon2BOSS') {
          moonIndex = index;
          w = 850;
          h = 925;
          obstarr = [enem[0] + 60, enem[0] + w, enem[1] - 120, enem[1] + h];
          if (hurtboxSword.length < 4) {
            headw = 105;
            headh = 120;
            bodyw = 345;
            bodyh = 425;
            sww = 300;
            swh = 130;
            hurtboxHead = [
              obstarr[0] + 580,
              obstarr[0] + 580 + headw,
              obstarr[2] + 430,
              obstarr[2] + 430 + headh
            ];
            hurtboxBody = [
              obstarr[0] + 510,
              obstarr[0] + 510 + bodyw,
              obstarr[2] + 500,
              obstarr[2] + 500 + bodyh
            ];
            hurtboxSword = [
              obstarr[0] + 250,
              obstarr[0] + 250 + sww,
              obstarr[2] + 760,
              obstarr[2] + 760 + swh
            ];
          }

          //  console.log(enem);ss
          //  console.log(enemFrames[index]);
          // console.log(bossSprites.names[enemFrames[index]]);
          bossSprites.draw(
            bossSprites.names[enemFrames[index]],
            context,
            enem[0] - camera.pos.x,
            enem[1] - camera.pos.y - 40
          );

          // drawOutline(context, obstarr[0], obstarr[2], w, h, camera);
          // drawOutline(
          //   context,
          //   hurtboxHead[0],
          //   hurtboxHead[2],
          //   headw,
          //   headh,
          //   camera
          // );
          // drawOutline(
          //   context,
          //   hurtboxBody[0],
          //   hurtboxBody[2],
          //   bodyw,
          //   bodyh,
          //   camera
          // );
          // drawOutline(
          //   context,
          //   hurtboxSword[0],
          //   hurtboxSword[2],
          //   sww,
          //   swh,
          //   camera
          // );
          if (
            randbCount >= 10 &&
            enemies[index][0] - hero.pos.x < 1000 &&
            enemies[index][1] - hero.pos.y < 1000
          ) {
            // boss anim
            var animoffset = 0;
            //     moonHelmStatus = 2;
            enemFrames[index] += 1;
            // if (moonAttack == true && enemFrames[index] == 30 + animoffset) {
            //   enemFrames[index] = 0 + 9 * moonHelmStatus;
            //   moonAttack = false;
            // } else

            // if (moonDeath === true) {
            //   enemFrames[index] = 53;
            // } else
            if (
              moonAttack == true &&
              enemFrames[index] == 30 + 3 * moonHelmStatus + attack * 9
            ) {
              moonAttack = false;
              enemFrames[index] = 0 + 9 * moonHelmStatus;
              hurtboxSword = [];
            } else if (
              moonAttack == true &&
              (enemFrames[index] == 45 ||
                enemFrames[index] == 48 ||
                enemFrames[index] == 51)
            ) {
              hurtboxSword[0] -= 200;
              hurtboxSword[2] -= 260;
              hurtboxSword[3] -= 260 + swh;
            } else if (enemFrames[index] == 9 + 9 * moonHelmStatus) {
              //if (rando > 0.95) {
              moonAttack = true;

              attack = Math.floor(Math.round(Math.random() * (2 - 0)));
              attack = 2;
              enemFrames[index] = 27 + 3 * moonHelmStatus + attack * 9;
              if (attack == 0) {
                swh *= 3;

                hurtboxSword[0] -= 300;
                hurtboxSword[1] -= 300;
                hurtboxSword[2] -= 460;
                hurtboxSword[3] -= 460 + swh;
              } else if (attack == 1) {
                swh *= 3;
                hurtboxSword[0] += 75;
                hurtboxSword[2] -= 460;
                hurtboxSword[3] -= 460 + swh;
              } else {
                hurtboxSword[0] -= 200;
                hurtboxSword[2] -= 260;
                hurtboxSword[3] -= 260 + swh;
              }

              // }
              //enemFrames[index] = 0 + animoffset;
            }
            randbCount = 0;
          }
        }

        if (enemType[index] !== 'moon2BOSS') {
          if (
            hero.pos.y + heroSize.height - camera.pos.y >
              obstarr[2] - camera.pos.y &&
            hero.pos.y - camera.pos.y < obstarr[3] - camera.pos.y &&
            hero.pos.x - camera.pos.x < obstarr[1] - camera.pos.x &&
            hero.pos.x + heroSize.width - camera.pos.x >
              obstarr[0] - camera.pos.x
          ) {
            //enemFrames[index] = 4;
            //projFrames[index] = 5;
            hero.hp -= 1;
            console.log(index);
            enemies.splice(index, 1);
            enemType.splice(index, 1);
            enemFrames.splice(index, 1);
            enemiesOrig.splice(index, 1);
            return;
          }
        } else {
          if (
            (hero.pos.y + heroSize.height - camera.pos.y >
              hurtboxBody[2] - camera.pos.y &&
              hero.pos.y - camera.pos.y < hurtboxBody[3] - camera.pos.y &&
              hero.pos.x - camera.pos.x < hurtboxBody[1] - camera.pos.x &&
              hero.pos.x + heroSize.width - camera.pos.x >
                hurtboxBody[0] - camera.pos.x) ||
            (hero.pos.y + heroSize.height - camera.pos.y >
              hurtboxSword[2] - camera.pos.y &&
              hero.pos.y - camera.pos.y < hurtboxSword[3] - camera.pos.y &&
              hero.pos.x - camera.pos.x < hurtboxSword[1] - camera.pos.x &&
              hero.pos.x + heroSize.width - camera.pos.x >
                hurtboxSword[0] - camera.pos.x)
          ) {
            // enemFrames[index] = 4;
            //projFrames[index] = 5;
            hero.hp -= 1;
          //  console.log(index);
            // enemies.splice(index, 1);
            // enemType.splice(index, 1);
            // enemFrames.splice(index, 1);
            // enemiesOrig.splice(index, 1);
            return;
          }
        }
        var tmpa = 0;
        if (enemType[index] === 'moon2GUM') {
          //  tmpa = Math.floor(enemFrames[index] / 11);

          randCount += 1;
          if (randCount == 25) {
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
          if (
            randmCount >= 100 &&
            enemies[index][0] - hero.pos.x < 500 &&
            enemies[index][1] - hero.pos.y < 500
          ) {
            if (rando > 0.95) {
              mageProjArr.push([enem[0], enem[1], 50, 50]);

              mageProjVecArr.push([
                (hero.pos.x - enem[0]) / 200,
                (hero.pos.y - enem[1]) / 200
              ]);
              mageProjInd.push(index);
              mageProjOrig.push([enemiesOrig[index][0], enemiesOrig[index][1]]);
              if (hero.pos.x - enem[0] < 0) {
                mageProjFrames.push(8);
              } else {
                mageProjFrames.push(0);
              }
            }

            if (randmCount >= 101) {
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
          // drawOutline(context, mproj[0], mproj[1], 88, 43, camera);
          mproj[0] += mageProjVecArr[mindex][0];
          mproj[1] += mageProjVecArr[mindex][1];

          mageProjFrames[mindex] += 1;
          if (mageProjFrames[mindex] == 5) {
            mageProjFrames[mindex] = 2;
          } else if (mageProjFrames[mindex] == 11) {
            mageProjFrames[mindex] = 8;
          }
          //console.log(Math.abs(mproj[1] - mageProjOrig[mindex][1]));
          if (
            Math.abs(mproj[0] - mageProjOrig[mindex][0]) > 400 ||
            Math.abs(mproj[1] - mageProjOrig[mindex][1]) > 400
          ) {
            mageProjArr.splice(mindex, 1);
            mageProjFrames.splice(mindex, 1);
            mageProjVecArr.splice(mindex, 1);
            mageProjOrig.splice(mindex, 1);
            // enemies.splice(mageProjInd[remmInd[(i -= count)]], 1);
            mageProjInd.splice(mindex, 1);
          } else {
            if (
              hero.pos.y + heroSize.height - camera.pos.y >
                mproj[1] - camera.pos.y &&
              hero.pos.y - camera.pos.y < mproj[1] + 43 - camera.pos.y &&
              hero.pos.x - camera.pos.x < mproj[0] + 88 - camera.pos.x &&
              hero.pos.x + heroSize.width - camera.pos.x >
                mproj[0] - camera.pos.x
            ) {
              //enemFrames[eIndex] = 4;
              // projFrames[index] = 5;
              // remIndEnemy.push(eIndex);
              //remInd.push(index);
              hero.hp -= 1;
              // remmInd.push(mindex);
              mageProjArr.splice(mindex, 1);
              mageProjFrames.splice(mindex, 1);
              mageProjVecArr.splice(mindex, 1);
              mageProjOrig.splice(mindex, 1);
              // enemies.splice(mageProjInd[remmInd[(i -= count)]], 1);
              mageProjInd.splice(mindex, 1);
            }
          }
        });
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
            var obstarr = [];
            if (enemType[eIndex] == 'moon2GUM') {
              w = 200;
              h = 150;
              obstarr = [obst[0], obst[0] + w, obst[1], obst[1] + h];
            } else if (enemType[eIndex] == 'moon2BOSS') {
              if (
                proj[1] + 40 - camera.pos.y > hurtboxHead[2] - camera.pos.y &&
                proj[1] - camera.pos.y < hurtboxHead[3] - camera.pos.y &&
                proj[0] - camera.pos.x < hurtboxHead[1] - camera.pos.x &&
                proj[0] + 65 - camera.pos.x > hurtboxHead[0] - camera.pos.x

                // hero.pos.y + heroSize.height > obstacles[2] + leeway &&
                // hero.pos.y < obstacles[3] - leeway &&
                // hero.pos.x < obstacles[1] - leeway &&
                // hero.pos.x + heroSize.width > obstacles[0] + leeway
              ) {
                // enemFrames[eIndex] = 4;
                // projFrames[index] = 5;

                if (moonHelmStatus < 2) {
                  moonHelmStatus += 1;
                } else {
                  moonDeath = true;
                  enemFrames[moonIndex] = 53;
                  setTimeout(() => {
                    enemies.splice(eIndex, 1);
                    enemType.splice(eIndex, 1);
                    enemFrames.splice(eIndex, 1);
                    enemiesOrig.splice(eIndex, 1);
                  }, 2000);
                }
                projArr.splice(index, 1);
                projFrames.splice(index, 1);
                projVecArr.splice(index, 1);
              }
            } else if (enemType[eIndex] == 'moon2MAGE') {
              w = 180;
              h = 220;
              obstarr = [obst[0], obst[0] + w, obst[1], obst[1] + h];
              obstarr[0] += 40;
              obstarr[2] -= 10;
            }
            // drawOutline(context, obstarr[0], obstarr[2], w, h, camera);
            // drawOutline(context, proj[0], proj[1], 65, 40, camera);

            if (
              proj[1] + 40 - camera.pos.y > obstarr[2] - camera.pos.y &&
              proj[1] - camera.pos.y < obstarr[3] - camera.pos.y &&
              proj[0] - camera.pos.x < obstarr[1] - camera.pos.x &&
              proj[0] + 65 - camera.pos.x > obstarr[0] - camera.pos.x

              // hero.pos.y + heroSize.height > obstacles[2] + leeway &&
              // hero.pos.y < obstacles[3] - leeway &&
              // hero.pos.x < obstacles[1] - leeway &&
              // hero.pos.x + heroSize.width > obstacles[0] + leeway
            ) {
              enemFrames[eIndex] = 4;
              projFrames[index] = 5;

              projArr.splice(index, 1);
              projFrames.splice(index, 1);
              projVecArr.splice(index, 1);

              setTimeout(() => {
                enemies.splice(eIndex, 1);
                enemType.splice(eIndex, 1);
                enemFrames.splice(eIndex, 1);
                enemiesOrig.splice(eIndex, 1);
              }, 75);
            }
          });

          if (proj[0] > hero.pos.x + 1000) {
            projArr.splice(index, 1);
            projFrames.splice(index, 1);
            projVecArr.splice(index, 1);
          }
        });
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
      if (transition) click.y += camera.pos.y - 25;
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
              hero.pos.y += -20;
              hero.grapple = true;
              hero.grapplePos.x = click.x;
              hero.grapplePos.y = click.y;

              if (click.x >= hero.pos.x) {
                hero.facingLeft = false;
              } else {
                if (click.x < hero.pos.x) {
                  hero.facingLeft = true;
                }
              }
              hero.vel.set(
                (hero.grapplePos.x - hero.pos.x) * 1.5,
                (hero.grapplePos.y - hero.pos.y) * 1.5
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
