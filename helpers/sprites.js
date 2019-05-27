const { loadImage, loadLevel } = require("./loaders.js");
const SpriteSheet = require("./SpriteSheet.js");

const spriteSize = {
  width: 138 * 1.4,
  height: 136 * 1.4
};

// function loadBackgroundSprites() {
//   return loadImage("./img/tiles.png").then(image => {
//     const sprites = new SpriteSheet(image, 16, 16);
//     sprites.define("longrect", 0, 0, 16, 16);
//     sprites.define("boi", 0, 1, 16, 16);
//     sprites.define("tallrect", 0, 2, 16, 16);
//     return sprites;
//   });
// }

function loadBOSSSprites() {
  return loadImage("./img/spriteSheetBoss.png").then(image => {
    const sprites = new SpriteSheet(image, 1096, 850);
    sprites.define("idle1", 0, 0, 1096, 850);
    sprites.define("idle2", 1, 0, 1096, 850);
    sprites.define("idle3", 2, 0, 1096, 850);
    sprites.define("idle4", 3, 0, 1096, 850);
    sprites.define("idle5", 4, 0, 1096, 850);
    sprites.define("idle6", 5, 0, 1096, 850);
    sprites.define("idle7", 0, 1, 1096, 850);
    sprites.define("idle8", 1, 1, 1096, 850);
    sprites.define("idle9", 2, 1, 1096, 850);

    sprites.define("idle1h", 3, 1, 1096, 850);
    sprites.define("idle2h", 4, 1, 1096, 850);
    sprites.define("idle3h", 5, 1, 1096, 850);
    sprites.define("idle4h", 0, 2, 1096, 850);
    sprites.define("idle5h", 1, 2, 1096, 850);
    sprites.define("idle6h", 2, 2, 1096, 850);
    sprites.define("idle7h", 3, 2, 1096, 850);
    sprites.define("idle8h", 4, 2, 1096, 850);
    sprites.define("idle9h", 5, 2, 1096, 850);

    sprites.define("idle1b", 0, 3, 1096, 850);
    sprites.define("idle2b", 1, 3, 1096, 850);
    sprites.define("idle3b", 2, 3, 1096, 850);
    sprites.define("idle4b", 3, 3, 1096, 850);
    sprites.define("idle5b", 4, 3, 1096, 850);
    sprites.define("idle6b", 5, 3, 1096, 850);
    sprites.define("idle7b", 0, 4, 1096, 850);
    sprites.define("idle8b", 1, 4, 1096, 850);
    sprites.define("idle9b", 1, 4, 1096, 850);

    sprites.define("swing1", 2, 4, 1096, 850);
    sprites.define("swing2", 3, 4, 1096, 850);
    sprites.define("swing3", 4, 4, 1096, 850);

    sprites.define("swing1h", 5, 4, 1096, 850);
    sprites.define("swing2h", 0, 5, 1096, 850);
    sprites.define("swing3h", 1, 5, 1096, 850);

    sprites.define("swing1b", 2, 5, 1096, 850);
    sprites.define("swing2b", 3, 5, 1096, 850);
    sprites.define("swing3b", 4, 5, 1096, 850);

    sprites.define("swing11", 5, 5, 1096, 850);
    sprites.define("swing22", 0, 6, 1096, 850);
    sprites.define("swing33", 1, 6, 1096, 850);

    sprites.define("swing11h", 2, 6, 1096, 850);
    sprites.define("swing22h", 3, 6, 1096, 850);
    sprites.define("swing33h", 4, 6, 1096, 850);

    sprites.define("swing11b", 5, 6, 1096, 850);
    sprites.define("swing22b", 0, 7, 1096, 850);
    sprites.define("swing33b", 1, 7, 1096, 850);

    sprites.define("swing111", 2, 7, 1096, 850);
    sprites.define("swing222", 3, 7, 1096, 850);
    sprites.define("swing333", 4, 7, 1096, 850);

    sprites.define("swing111h", 5, 7, 1096, 850);
    sprites.define("swing222h", 0, 8, 1096, 850);
    sprites.define("swing333h", 1, 8, 1096, 850);

    sprites.define("swing111b", 2, 8, 1096, 850);
    sprites.define("swing222b", 3, 8, 1096, 850);
    sprites.define("swing333b", 4, 8, 1096, 850);

    sprites.define("death1", 5, 8, 1096, 850);
    sprites.define("death2", 0, 9, 1096, 850);
    sprites.define("death3", 1, 9, 1096, 850);
    sprites.define("death4", 2, 9, 1096, 850);
    sprites.define("death5", 3, 9, 1096, 850);
    sprites.define("death6", 4, 9, 1096, 850);
    sprites.define("death7", 5, 9, 1096, 850);
    sprites.define("death8", 0, 10, 1096, 850);
    sprites.define("death9", 1, 11, 1096, 850);
    sprites.define("death10", 2, 12, 1096, 850);
    sprites.define("death11", 3, 13, 1096, 850);
    sprites.define("death12", 4, 14, 1096, 850);

    return sprites;
  });
}
function loadGumSprites() {
  return loadImage("./img/spriteSheetSpider.png").then(image => {
    const sprites = new SpriteSheet(image, 200, 150);
    sprites.define("idle", 0, 0, 200, 150);
    sprites.define("crouch", 2, 0, 200, 150);
    sprites.define("idleL", 0, 1, 200, 150);
    sprites.define("crouchL", 2, 1, 200, 150);
    sprites.define("hurt", 1, 1, 200, 150);
    sprites.define("hurtL", 1, 1, 200, 150);
    return sprites;
  });
}

function loadMageSprites() {
  return loadImage("./img/spriteSheetMage.png").then(image => {
    const sprites = new SpriteSheet(image, 250, 250);
    sprites.define("idle", 0, 1, 250, 250);
    sprites.define("idleL", 0, 0, 250, 250);
    sprites.define("attack", 2, 1, 250, 250);
    sprites.define("attackL", 2, 0, 250, 250);
    sprites.define("hurt", 1, 1, 250, 250);
    sprites.define("hurtL", 1, 1, 250, 250);
    return sprites;
  });
}
function loadMageProjectileSprites() {
  return loadImage("./img/spriteSheetEnemyFireball.png").then(image => {
    const sprites = new SpriteSheet(image, 88, 43);
    sprites.define("fireball1", 0, 1, 88, 43);
    sprites.define("fireball2", 1, 1, 88, 43);
    sprites.define("fireball3", 2, 1, 88, 43);
    sprites.define("fireball4", 3, 1, 88, 43);
    sprites.define("fireball5", 4, 1, 88, 43);
    sprites.define("fireball6", 5, 1, 88, 43);
    sprites.define("fireballL1", 0, 0, 88, 43);
    sprites.define("fireballL2", 1, 0, 88, 43);
    sprites.define("fireballL3", 2, 0, 88, 43);
    sprites.define("fireballL4", 3, 0, 88, 43);
    sprites.define("fireballL5", 4, 0, 88, 43);
    sprites.define("fireballL6", 5, 0, 88, 43);
    return sprites;
  });
}
function loadProjectileSprites() {
  return loadImage("./img/spriteSheetFireball.png").then(image => {
    const sprites = new SpriteSheet(image, 88, 43);
    sprites.define("fireball1", 0, 0, 88, 43);
    sprites.define("fireball2", 1, 0, 88, 43);
    sprites.define("fireball3", 2, 0, 88, 43);
    sprites.define("fireball4", 3, 0, 88, 43);
    sprites.define("fireball5", 4, 0, 88, 43);
    sprites.define("fireball6", 5, 0, 88, 43);
    sprites.define("fireballL1", 0, 1, 88, 43);
    sprites.define("fireballL2", 1, 1, 88, 43);
    sprites.define("fireballL3", 2, 1, 88, 43);
    sprites.define("fireballL4", 3, 1, 88, 43);
    sprites.define("fireballL5", 4, 1, 88, 43);
    sprites.define("fireballL6", 5, 1, 88, 43);
    return sprites;
  });
}
function loadHeroSprite() {
  return loadImage("./img/spriteSheetHero.png").then(image => {
    const sprite = new SpriteSheet(image, 231, 227);
    sprite.define("dead0", 0, 13, spriteSize.width, spriteSize.height);
    sprite.define("dead1", 1, 13, spriteSize.width, spriteSize.height);
    sprite.define("dead2", 2, 13, spriteSize.width, spriteSize.height);
    sprite.define("dead3", 3, 13, spriteSize.width, spriteSize.height);
    sprite.define("dead4", 4, 13, spriteSize.width, spriteSize.height);
    sprite.define("dead5", 5, 13, spriteSize.width, spriteSize.height);
    sprite.define("dead6", 6, 14, spriteSize.width, spriteSize.height);

    sprite.define("idle", 1, 2, spriteSize.width, spriteSize.height);
    sprite.define("idleL", 1, 9, spriteSize.width, spriteSize.height);

    sprite.define("run1", 0, 0, spriteSize.width, spriteSize.height);
    sprite.define("run2", 1, 0, spriteSize.width, spriteSize.height);
    sprite.define("run3", 2, 0, spriteSize.width, spriteSize.height);
    sprite.define("run4", 3, 0, spriteSize.width, spriteSize.height);
    sprite.define("run5", 4, 0, spriteSize.width, spriteSize.height);
    sprite.define("run6", 5, 0, spriteSize.width, spriteSize.height);
    sprite.define("run7", 0, 1, spriteSize.width, spriteSize.height);
    sprite.define("run8", 1, 1, spriteSize.width, spriteSize.height);
    sprite.define("run9", 2, 1, spriteSize.width, spriteSize.height);
    sprite.define("run10", 3, 1, spriteSize.width, spriteSize.height);
    sprite.define("run11", 4, 1, spriteSize.width, spriteSize.height);
    sprite.define("run12", 5, 1, spriteSize.width, spriteSize.height);

    sprite.define("run1L", 0, 7, spriteSize.width, spriteSize.height);
    sprite.define("run2L", 1, 7, spriteSize.width, spriteSize.height);
    sprite.define("run3L", 2, 7, spriteSize.width, spriteSize.height);
    sprite.define("run4L", 3, 7, spriteSize.width, spriteSize.height);
    sprite.define("run5L", 4, 7, spriteSize.width, spriteSize.height);
    sprite.define("run6L", 5, 7, spriteSize.width, spriteSize.height);
    sprite.define("run7L", 0, 8, spriteSize.width, spriteSize.height);
    sprite.define("run8L", 1, 8, spriteSize.width, spriteSize.height);
    sprite.define("run9L", 2, 8, spriteSize.width, spriteSize.height);
    sprite.define("run10L", 3, 8, spriteSize.width, spriteSize.height);
    sprite.define("run11L", 4, 8, spriteSize.width, spriteSize.height);
    sprite.define("run12L", 5, 8, spriteSize.width, spriteSize.height);

    sprite.define("run1sh", 0, 5, spriteSize.width, spriteSize.height);
    sprite.define("run2sh", 1, 5, spriteSize.width, spriteSize.height);
    sprite.define("run3sh", 2, 5, spriteSize.width, spriteSize.height);
    sprite.define("run4sh", 3, 5, spriteSize.width, spriteSize.height);
    sprite.define("run5sh", 4, 5, spriteSize.width, spriteSize.height);
    sprite.define("run6sh", 5, 5, spriteSize.width, spriteSize.height);
    sprite.define("run7sh", 0, 6, spriteSize.width, spriteSize.height);
    sprite.define("run8sh", 1, 6, spriteSize.width, spriteSize.height);
    sprite.define("run9sh", 2, 6, spriteSize.width, spriteSize.height);
    sprite.define("run10sh", 3, 6, spriteSize.width, spriteSize.height);
    sprite.define("run11sh", 4, 6, spriteSize.width, spriteSize.height);
    sprite.define("run12sh", 5, 6, spriteSize.width, spriteSize.height);

    sprite.define("run1shL", 0, 11, spriteSize.width, spriteSize.height);
    sprite.define("run2shL", 1, 11, spriteSize.width, spriteSize.height);
    sprite.define("run3shL", 2, 11, spriteSize.width, spriteSize.height);
    sprite.define("run4shL", 3, 11, spriteSize.width, spriteSize.height);
    sprite.define("run5shL", 4, 11, spriteSize.width, spriteSize.height);
    sprite.define("run6shL", 5, 11, spriteSize.width, spriteSize.height);
    sprite.define("run7shL", 0, 12, spriteSize.width, spriteSize.height);
    sprite.define("run8shL", 1, 12, spriteSize.width, spriteSize.height);
    sprite.define("run9shL", 2, 12, spriteSize.width, spriteSize.height);
    sprite.define("run10shL", 3, 12, spriteSize.width, spriteSize.height);
    sprite.define("run11shL", 4, 12, spriteSize.width, spriteSize.height);
    sprite.define("run12shL", 5, 12, spriteSize.width, spriteSize.height);

    sprite.define("jump1", 1, 4, spriteSize.width, spriteSize.height);
    sprite.define("jump1L", 3, 10, spriteSize.width, spriteSize.height);

    sprite.define("fall1", 4, 3, spriteSize.width, spriteSize.height);
    sprite.define("fall1L", 0, 10, spriteSize.width, spriteSize.height);

    sprite.define("grapple", 2, 2, spriteSize.width, spriteSize.height);
    sprite.define("grappleL", 2, 9, spriteSize.width, spriteSize.height);
    sprite.define("shoot", 3, 3, spriteSize.width, spriteSize.height);
    sprite.define("shootLeft", 5, 9, spriteSize.width, spriteSize.height);
    sprite.define("hangBottom", 1, 3, spriteSize.width, spriteSize.height);
    sprite.define("hangBottomL", 4, 4, spriteSize.width, spriteSize.height);
    sprite.define("hangRight", 5, 2, spriteSize.width, spriteSize.height);
    sprite.define("hangLeft", 2, 4, spriteSize.width, spriteSize.height);
    sprite.define("hangBottomShoot", 2, 3, spriteSize.width, spriteSize.height);
    sprite.define(
      "hangBottomShootLeft",
      5,
      4,
      spriteSize.width,
      spriteSize.height
    );
    sprite.define("hangRightShoot", 0, 3, spriteSize.width, spriteSize.height);
    sprite.define("hangLeftShoot", 3, 4, spriteSize.width, spriteSize.height);
    return sprite;
  });
}

function loadLevelBlocks() {
  return loadImage("./img/fancyBlocks.png").then(image => {
    const blocks = new SpriteSheet(image, 100, 100);
    blocks.define("ground", 0, 5, 100, 100);
    blocks.define("p0", 2, 1, 100, 100);
    blocks.define("p2", 3, 1, 100, 100);
    blocks.define("p3", 4, 1, 100, 100);
    blocks.define("p4", 0, 2, 100, 100);
    blocks.define("p5", 1, 2, 100, 100);
    blocks.define("p6", 2, 2, 100, 100);
    blocks.define("p7", 3, 2, 100, 100);
    blocks.define("p8", 4, 2, 100, 100);
    blocks.define("gP0", 0, 0, 100, 100);
    blocks.define("gP1", 0, 1, 100, 100);
    blocks.define("gP2", 1, 0, 100, 100);
    blocks.define("gP3", 1, 1, 100, 100);
    blocks.define("arch0", 9, 0, 100, 100);
    blocks.define("arch1", 10, 0, 100, 100);
    blocks.define("arch2", 9, 1, 100, 100);
    blocks.define("arch3", 10, 1, 100, 100);
    blocks.define("arch4", 9, 2, 100, 100);
    blocks.define("shortWide0", 2, 0, 100, 100);
    blocks.define("shortWide1", 3, 0, 100, 100);
    blocks.define("shortWide2", 4, 0, 100, 100);
    blocks.define("tallSkinny0", 8, 0, 100, 100);
    blocks.define("tallSkinny1", 8, 1, 100, 100);
    blocks.define("tallSkinny2", 8, 2, 100, 100);
    blocks.define("topSpikes0", 5, 2, 100, 100);
    blocks.define("topSpikes1", 6, 2, 100, 100);
    blocks.define("topSpikes2", 7, 2, 100, 100);
    blocks.define("pungy0", 0, 3, 100, 100);
    blocks.define("pungy1", 1, 3, 100, 100);
    blocks.define("pungy2", 0, 4, 100, 100);
    blocks.define("pungy3", 1, 4, 100, 100);
    blocks.define("cross0", 11, 0, 100, 100);
    blocks.define("cross1", 12, 0, 100, 100);
    blocks.define("cross2", 11, 1, 100, 100);
    blocks.define("cross3", 12, 1, 100, 100);
    blocks.define("cross4", 11, 2, 100, 100);
    blocks.define("cross5", 12, 2, 100, 100);
    blocks.define("cross6", 11, 3, 100, 100);
    blocks.define("cross7", 12, 3, 100, 100);
    blocks.define("leftSpike0", 5, 3, 100, 100);
    blocks.define("leftSpike1", 5, 4, 100, 100);
    blocks.define("rightSpike0", 6, 3, 100, 100);
    blocks.define("rightSpike1", 6, 4, 100, 100);
    return blocks;
  });
}

function loadStatic() {
  return loadImage("./img/background.png").then(image => {
    const sprite = new SpriteSheet(image, 1920, 1080);
    sprite.define("static", 0, 0, 1920, 1080);
    return sprite;
  });
}

function loadScrolling() {
  return loadImage("./img/scrollingBackground.png").then(image => {
    const sprite = new SpriteSheet(image, 5146, 1196);
    sprite.define("scrolling", 0, 0, 5146, 1196);
    return sprite;
  });
}

function loadGrappleSpritesRight() {
  return loadImage("./img/spriteSheetGrapple.png").then(image => {
    const sprite = new SpriteSheet(image, 66, 69);
    sprite.define("frame0", 0, 0, 66, 69);
    sprite.define("frame1", 1, 0, 66, 69);
    sprite.define("frame2", 2, 0, 66, 69);
    return sprite;
  });
}

function loadGrappleSpritesLeft() {
  return loadImage("./img/spriteSheetGrapple.png").then(image => {
    const sprite = new SpriteSheet(image, 66, 69);
    sprite.define("frame0", 0, 1, 66, 69);
    sprite.define("frame1", 1, 1, 66, 69);
    sprite.define("frame2", 2, 1, 66, 69);
    return sprite;
  });
}

module.exports = {
  // loadBackgroundSprites: loadBackgroundSprites,
  loadHeroSprite: loadHeroSprite,
  loadStatic: loadStatic,
  spriteSize: spriteSize,
  loadProjectileSprites: loadProjectileSprites,
  loadLevelBlocks: loadLevelBlocks,
  loadScrolling: loadScrolling,
  loadGumSprites: loadGumSprites,
  loadMageSprites: loadMageSprites,
  loadGrappleSpritesRight: loadGrappleSpritesRight,
  loadGrappleSpritesLeft: loadGrappleSpritesLeft,
  loadMageProjectileSprites: loadMageProjectileSprites,
  loadBOSSSprites: loadBOSSSprites
};
