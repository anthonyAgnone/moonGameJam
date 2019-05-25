const { loadImage, loadLevel } = require('./loaders.js');
const SpriteSheet = require('./SpriteSheet.js');

const spriteSize = {
  width: 138,
  height: 136
};

function loadBackgroundSprites() {
  return loadImage('./img/tiles.png').then(image => {
    const sprites = new SpriteSheet(image, 16, 16);
    sprites.define('longrect', 0, 0, 16, 16);
    sprites.define('boi', 0, 1, 16, 16);
    sprites.define('tallrect', 0, 2, 16, 16);
    return sprites;
  });
}

function loadHeroSprite() {
  return loadImage('./img/tempCharSheet.png').then(image => {
    const sprite = new SpriteSheet(image, 231, 227);
    sprite.define('idle', 1, 2, spriteSize.width, spriteSize.height);
    return sprite;
  });
}

function loadStatic() {
  return loadImage('./img/background.png').then(image => {
    const sprite = new SpriteSheet(image, 1920, 1080);
    sprite.define('static', 0, 0, 1920, 1080);
    return sprite;
  });
}

module.exports = {
  loadBackgroundSprites: loadBackgroundSprites,
  loadHeroSprite: loadHeroSprite,
  loadStatic: loadStatic,
  spriteSize: spriteSize
};
