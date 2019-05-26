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

function loadProjectileSprites() {
  return loadImage('./img/spriteSheetFireball.png').then(image => {
    const sprites = new SpriteSheet(image, 88, 43);
    sprites.define('fireball1', 0, 0, 88, 43);
    sprites.define('fireball2', 1, 0, 88, 43);
    sprites.define('fireball3', 2, 0, 88, 43);
    sprites.define('fireball4', 3, 0, 88, 43);
    sprites.define('fireball5', 4, 0, 88, 43);
    sprites.define('fireball6', 5, 0, 88, 43);
    return sprites;
  });
}
function loadHeroSprite() {
  return loadImage('./img/main.png').then(image => {
    const sprite = new SpriteSheet(image, 231, 227);
    sprite.define('idle', 1, 2, spriteSize.width, spriteSize.height);
    sprite.define('run1', 0, 0, spriteSize.width, spriteSize.height);
    sprite.define('run2', 1, 0, spriteSize.width, spriteSize.height);
    sprite.define('run3', 2, 0, spriteSize.width, spriteSize.height);
    sprite.define('run4', 3, 0, spriteSize.width, spriteSize.height);
    sprite.define('run5', 4, 0, spriteSize.width, spriteSize.height);
    sprite.define('run6', 5, 0, spriteSize.width, spriteSize.height);
    sprite.define('run7', 0, 1, spriteSize.width, spriteSize.height);
    sprite.define('run8', 1, 1, spriteSize.width, spriteSize.height);
    sprite.define('run9', 2, 1, spriteSize.width, spriteSize.height);
    sprite.define('run10', 3, 1, spriteSize.width, spriteSize.height);
    sprite.define('run11', 4, 1, spriteSize.width, spriteSize.height);
    sprite.define('run12', 5, 1, spriteSize.width, spriteSize.height);
    sprite.define('jump1', 1, 4, spriteSize.width, spriteSize.height);
    sprite.define('fall1', 4, 3, spriteSize.width, spriteSize.height);
    sprite.define('grapple', 2, 2, spriteSize.width, spriteSize.height);
    sprite.define('shoot', 3, 3, spriteSize.width, spriteSize.height);
    sprite.define('hangBottom', 1, 3, spriteSize.width, spriteSize.height);
    sprite.define('hangRight', 5, 2, spriteSize.width, spriteSize.height);
    sprite.define('hangLeft', 5, 2, spriteSize.width, spriteSize.height);
    sprite.define('hangBottomShoot', 2, 3, spriteSize.width, spriteSize.height);
    sprite.define('hangRightShoot', 0, 3, spriteSize.width, spriteSize.height);
    sprite.define('hangLeftShoot', 0, 3, spriteSize.width, spriteSize.height);
    return sprite;
  });
}

function loadStatic() {
  return loadImage('./img/background.png').then(image => {
    const sprite = new SpriteSheet(image, 1920, 1080);
    sprite.define('static', 0, 0, 9920, 1080);
    return sprite;
  });
}

module.exports = {
  loadBackgroundSprites: loadBackgroundSprites,
  loadHeroSprite: loadHeroSprite,
  loadStatic: loadStatic,
  spriteSize: spriteSize,
  loadProjectileSprites: loadProjectileSprites
};
