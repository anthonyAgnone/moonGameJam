const { loadImage, loadLevel } = require("./loaders.js");
const SpriteSheet = require("./SpriteSheet.js");

const spriteSize = {
  width: 138 * 1.4,
  height: 136 * 1.4
};

function loadBackgroundSprites() {
  return loadImage("./img/tiles.png").then(image => {
    const sprites = new SpriteSheet(image, 16, 16);
    sprites.define("longrect", 0, 0, 16, 16);
    sprites.define("boi", 0, 1, 16, 16);
    sprites.define("tallrect", 0, 2, 16, 16);
    return sprites;
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

    return blocks;
  });
}

function loadHeroSprite() {
  return loadImage("./img/spriteSheetHero.png").then(image => {
    const sprite = new SpriteSheet(image, 231, 227);
    sprite.define("idle", 1, 2, spriteSize.width, spriteSize.height);
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
    sprite.define("jump1", 1, 4, spriteSize.width, spriteSize.height);
    sprite.define("fall1", 4, 3, spriteSize.width, spriteSize.height);
    sprite.define("grapple", 2, 2, spriteSize.width, spriteSize.height);
    return sprite;
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

module.exports = {
  loadBackgroundSprites: loadBackgroundSprites,
  loadHeroSprite: loadHeroSprite,
  loadStatic: loadStatic,
  spriteSize: spriteSize,
  loadLevelBlocks: loadLevelBlocks,
  loadScrolling: loadScrolling
};
