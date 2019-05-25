const Entity = require('./Entity.js');
const { loadHeroSprite } = require('./sprites.js');

function createHero() {
  return loadHeroSprite().then(sprite => {
    const hero = new Entity();

    hero.draw = function drawHero(context) {
      sprite.draw('idle', context, this.pos.x, this.pos.y);
    };

    hero.update = function updateHero(deltaTime) {
      if (this.pos.x < canvas.width - 200 && this.pos.x > 0) {
        this.pos.x += this.vel.x * deltaTime;
      }
      if (this.pos.y < canvas.height - 200 && this.pos.y > 0) {
        this.pos.y += this.vel.y * deltaTime;
      }
      //this.pos.x += this.vel.x * deltaTime;
      // this.pos.y += this.vel.y * deltaTime;
    };

    return hero;
  });
}

module.exports = {
  createHero: createHero
};
