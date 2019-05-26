const Entity = require('./Entity.js');
const { loadHeroSprite } = require('./sprites.js');

function createHero(h, w) {
  return loadHeroSprite().then(sprite => {
    const hero = new Entity(h, w);

    let currentFrame;

    hero.update = function updateHero(deltaTime) {
      if (this.pos.x < canvas.width - 200 && this.pos.x > 0) {
        this.pos.x += this.vel.x * deltaTime * 0.5;
      }

      if (this.pos.y < canvas.height - 200 && this.pos.y > 0) {
        this.pos.y += this.vel.y * deltaTime * 0.5;
      }
      if (this.vel.y !== 0) this.isFlying = true;

      this.lastPos.x = this.pos.x;
      this.lastPos.y = this.pos.y;
      this.pos.x += this.vel.x * deltaTime;
      this.pos.y += this.vel.y * deltaTime;
      if (!this.isFlying || this.collisionDirection == 'TOP')
        this.lastPos.y = this.pos.y;
      this.distance = this.vel.x * deltaTime;
      if (this.vel.x == 0) this.startPoint = this.pos.x;
      currentFrame =
        Math.floor(Math.abs(this.pos.x - this.startPoint) / 30) % frames.length;

      if (hero.shooting === true && hero.shootFrame > 10) {
        hero.shootFrame = 0;
        hero.shooting = false;
      }
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
      console.log(hero.collisionDirection);
      if (hero.lastPos.x !== hero.pos.x && hero.lastPos.y == hero.pos.y)
        return frames[currentFrame];
      else if (hero.shooting === true && hero.collisionDirection === 'BOTTOM')
        return 'hangBottomShoot';
      else if (hero.shooting === true && hero.collisionDirection === 'RIGHT')
        return 'hangRightShoot';
      else if (hero.shooting === true && hero.collisionDirection === 'LEFT')
        return 'hangLeftShoot';
      else if (hero.shooting === true) return 'shoot';
      else if (hero.grapple === true && hero.collisionDirection === 'BOTTOM')
        return 'hangBottom';
      else if (hero.grapple === true && hero.collisionDirection === 'RIGHT')
        return 'hangRight';
      else if (hero.grapple === true && hero.collisionDirection === 'LEFT')
        return 'hangLeft';
      else if (hero.grapple === true) return 'grapple';
      else if (hero.vel.y < 0) return 'jump1';
      else if (hero.vel.y > 0 && hero.collisionDirection == 'NONE')
        return 'fall1';
      return 'idle';
    }
    hero.draw = function drawHero(context) {
      // console.log(routeFrame(this));
      sprite.draw(routeFrame(this), context, 0, 0);
    };

    return hero;
  });
}

module.exports = {
  createHero: createHero
};
