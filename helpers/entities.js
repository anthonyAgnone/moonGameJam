const Entity = require("./Entity.js");
const { loadHeroSprite } = require("./sprites.js");

function createHero() {
  return loadHeroSprite().then(sprite => {
    const hero = new Entity();

    hero.draw = function drawHero(context) {
      sprite.draw("idle", context, this.pos.x, this.pos.y);
    };

    hero.update = function updateHero(deltaTime) {
      this.pos.x += this.vel.x * deltaTime;
      this.pos.y += this.vel.y * deltaTime;
    };

    return hero;
  });
}

module.exports = {
  createHero: createHero
};
