const SpriteSheet = require("./SpriteSheet.js");
const { loadImage } = require("./loaders.js");

function loadHeroSprite() {
  return loadImage("./img/heroRun.png").then(image => {
    console.log("image loaded", image);
    const sprites = new SpriteSheet(image, 231, 227, 225, 227);
    sprites.defineTile("run", 0, 0);
    return sprites;
  });
}

function loadHeroIdle() {
  return loadImage("./img/heroRun.png").then(image => {
    console.log("image loaded", image);
    const sprites = new SpriteSheet(image, 231, 227, 225, 227);
    sprites.defineTile("idle", 3, 0);
    return sprites;
  });
}

function loadGroundSprites() {
  return loadImage("./img/tiles.png").then(image => {
    const sprites = new SpriteSheet(image, 16, 16, 16, 16);
    sprites.defineTile("ground", 0, 0);
    return sprites;
  });
}

function loadBackgroundSprite(w, h) {
  return loadImage("./img/background.png").then(image => {
    console.log("image loaded", image);
    const sprite = new SpriteSheet(image, w, h - 150, 1920, 10);
    sprite.defineTile("background", 0, 0);
    console.log(sprite);
    return sprite;
  });
}

module.exports = {
  loadHeroSprite: loadHeroSprite,
  loadGroundSprites: loadGroundSprites,
  loadBackgroundSprite: loadBackgroundSprite,
  loadHeroIdle: loadHeroIdle
};
