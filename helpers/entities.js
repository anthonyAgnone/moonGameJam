const Entity = require('./Entity.js');
const { loadHeroSprite } = require('./sprites.js');

function createHero() {
  return loadHeroSprite().then(sprite => {
    const hero = new Entity();

    let currentFrame;

    hero.update = function updateHero(deltaTime) {
      if (this.pos.x < canvas.width - 200 && this.pos.x > 0) {
        this.pos.x += this.vel.x * deltaTime * 0.5;
      }

      if (this.pos.y < canvas.height - 200 && this.pos.y > 0) {
        this.pos.y += this.vel.y * deltaTime * 0.5;
      } else {
        // this.vel.x = 0;
        //this.vel.y = 0;
      }

      this.lastPos.x = this.pos.x;
      this.lastPos.y = this.pos.y;
      this.pos.x += this.vel.x * deltaTime;
      this.pos.y += this.vel.y * deltaTime;
      this.distance = this.vel.x * deltaTime;
      if (this.vel.x == 0) this.startPoint = this.pos.x;
      currentFrame =
        Math.floor(Math.abs(this.pos.x - this.startPoint) / 21) % frames.length;

      // console.log(this.lastPos.x + ' ' + this.lastPos.y + ' ' + this.distance);
    };

    const frames = [
      'run1',
      'run2',
      'run3',
      'run4',
      'run5',
      'run6',
      'run7',
      'run8',
      'run9',
      'run10',
      'run11',
      'run12'
    ];

    function routeFrame(hero) {
      if (hero.lastPos.x !== hero.pos.x && hero.lastPos.y == hero.pos.y)
        return frames[currentFrame];
      else if (hero.vel.y < 0) return 'jump1';
      else if (hero.vel.y > 0) return 'fall1';
      return 'idle';
    }

    hero.draw = function drawHero(context) {
      sprite.draw(routeFrame(this), context, this.pos.x, this.pos.y);
    };

    return hero;
  });
}

module.exports = {
  createHero: createHero
};
