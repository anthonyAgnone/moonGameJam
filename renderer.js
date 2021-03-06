"use strict";

// DEPENDENCIES AND IMPORTS

const Compositor = require("./helpers/Compositor");
const Timer = require("./helpers/Timer");
const { loadLevel } = require("./helpers/loaders.js");
const { createHero, createProj } = require("./helpers/entities");
const Keyboard = require("./helpers/KeyboardState");
const Camera = require("./helpers/Camera");
const { getMousePos } = require("./helpers/mousePos");
const {
  setInitialPosition,
  addKeyMapping
} = require("./helpers/helperFunctions");
const { collisionDetect } = require("./helpers/collisionDetect");

const {
  loadBackgroundSprites,
  loadStatic,
  loadProjectileSprites,
  loadScrolling,
  loadLevelBlocks,
  loadGrappleSpritesRight,
  loadGrappleSpritesLeft
} = require("./helpers/sprites");

const SpritesJS = require("./helpers/sprites.js");
const { Vec2 } = require("./helpers/math");
const heroSize = SpritesJS.spriteSize;

const {
  createBackgroundLayer,
  createStaticLayer,
  createScrollingLayer,
  createSpriteLayer,
  createCameraLayer
} = require("./helpers/layers");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

var mysound = new Audio("./snd/Strange_Stuff.mp3");
mysound.loop = true;
mysound.play();

let currentLevel = "1-1";

// PROMISE ALL PERFORMS FOUR FUNCTIONS AND UPON SUCCESS THE DOT THEN HAPPENS WITH THOSE RESULTS

Promise.all([
  createHero(136, 138),
  loadLevelBlocks(),
  loadStatic(),
  loadScrolling(),
  loadLevel(currentLevel),
  loadProjectileSprites(),
  loadGrappleSpritesRight(),
  loadGrappleSpritesLeft()
]).then(
  ([
    hero,
    sprites,
    staticLayerSprite,
    scrollingSprite,
    level,
    projSprites,
    grappleSpritesRight,
    grappleSpritesLeft
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

    const obstacles = mapLevelToArray(level);

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

    const heroLayer = createSpriteLayer(hero, projSprites);
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

    timer.update = function update(deltaTime) {
      comp.draw(context, camera);
      camera.setPosition(hero.pos.x * 0.8, hero.pos.y * 0.05);
      if (camera.pos.x < 0) camera.pos.x = 0;
      collisionDetect(hero, obstacles, heroSize, deltaTime, gravity);
      context.strokeStyle = "red";
      context.beginPath();

      //fire grappling particle effect
      console.log(isMouseDown);
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
        //console.log(projFrames[index]);
        projFrames[index] += 1;
        if (projFrames[index] == 5) {
          projFrames[index] = 2;
        } else if (projFrames[index] == 11) {
          projFrames[index] = 8;
        }
      });

      if (remInd.length > 0) {
        //   projArr.splice(remInd);
        projArr[remInd] = [];
      }
      remInd = [];
    };

    var collisionDirection = "NONE";

    // input listeners
    const input = new Keyboard();
    input.listenTo(window);

    var projArr = new Array();
    var projVecArr = new Array();
    var projFrames = [];
    window.addEventListener("mousedown", event => {
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

    window.addEventListener("mouseup", () => {
      if (event.button === 0) {
        hero.grapple = false;
        hero.stopped = false;
        collisionDirection = "NONE";
        grappleReturnLeft = 0;
        grappleReturnRight = 0;
        isMouseDown = false;
      }
    });

    addKeyMapping(window, input, hero, gravity, timer);

    timer.start();
  }
);
