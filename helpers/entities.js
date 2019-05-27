const Entity = require("./Entity.js");
const { loadHeroSprite } = require("./sprites.js");

function createHero(h, w) {
  return loadHeroSprite().then(sprite => {
    const hero = new Entity(h, w);

    let currentFrame;

    hero.update = function updateHero(deltaTime) {
      if (this.vel.y !== 0) this.isFlying = true;

      this.lastPos.x = this.pos.x;
      this.lastPos.y = this.pos.y;
      this.pos.x += this.vel.x * deltaTime;
      this.pos.y += this.vel.y * deltaTime;
      if (!this.isFlying || this.collisionDirection == "TOP")
        this.lastPos.y = this.pos.y;
      this.distance = this.vel.x * deltaTime;
      if (this.vel.x == 0) this.startPoint = this.pos.x;
      currentFrame =
        Math.floor(Math.abs(this.pos.x - this.startPoint) / 30) % frames.length;

      if (hero.shooting === true && hero.shootFrame > 10) {
        hero.shootFrame = 0;
        hero.shooting = false;
        hero.shootingLeft = false;
      }
    };

    const frames = [
      "run1",
      "run2",
      "run3",
      "run4",
      "run5",
      "run6",
      "run7",
      "run8",
      "run9",
      "run10",
      "run11",
      "run12"
    ];
    const framesL = [
      "run1L",
      "run2L",
      "run3L",
      "run4L",
      "run5L",
      "run6L",
      "run7L",
      "run8L",
      "run9L",
      "run10L",
      "run11L",
      "run12L"
    ];

    const framesSh = [
      "run1sh",
      "run2sh",
      "run3sh",
      "run4sh",
      "run5sh",
      "run6sh",
      "run7sh",
      "run8sh",
      "run9sh",
      "run10sh",
      "run11sh",
      "run12sh"
    ];

    const framesShL = [
      "run1shL",
      "run2shL",
      "run3shL",
      "run4shL",
      "run5shL",
      "run6shL",
      "run7shL",
      "run8shL",
      "run9shL",
      "run10shL",
      "run11shL",
      "run12shL"
    ];

    function routeFrame(hero) {
      console.log(hero.collisionDirection);
      if (
        hero.lastPos.x !== hero.pos.x &&
        hero.lastPos.y == hero.pos.y &&
        hero.shooting === true &&
        hero.shootingLeft === true
      )
        return framesShL[currentFrame];
      else if (
        hero.lastPos.x !== hero.pos.x &&
        hero.lastPos.y == hero.pos.y &&
        hero.shooting === true
      )
        return framesSh[currentFrame];
      else if (
        hero.lastPos.x !== hero.pos.x &&
        hero.lastPos.y == hero.pos.y &&
        hero.vel.x < 0
      )
        return framesL[currentFrame];
      else if (hero.lastPos.x !== hero.pos.x && hero.lastPos.y == hero.pos.y)
        return frames[currentFrame];
      else if (
        hero.shooting === true &&
        hero.collisionDirection === "BOTTOM" &&
        hero.shootingLeft === true
      )
        return "hangBottomShootLeft";
      else if (hero.shooting === true && hero.collisionDirection === "BOTTOM")
        return "hangBottomShoot";
      else if (hero.shooting === true && hero.collisionDirection === "RIGHT")
        return "hangRightShoot";
      else if (hero.shooting === true && hero.collisionDirection === "LEFT")
        return "hangLeftShoot";
      else if (hero.shooting === true && hero.shootingLeft === true)
        return "shootLeft";
      else if (hero.shooting === true) return "shoot";
      else if (
        hero.grapple === true &&
        hero.collisionDirection === "BOTTOM" &&
        hero.facingLeft === true
      )
        return "hangBottomL";
      else if (hero.grapple === true && hero.collisionDirection === "BOTTOM")
        return "hangBottom";
      else if (hero.grapple === true && hero.collisionDirection === "RIGHT")
        return "hangRight";
      else if (hero.grapple === true && hero.collisionDirection === "LEFT")
        return "hangLeft";
      else if (hero.grapple === true && hero.facingLeft === true)
        return "grappleL";
      else if (hero.grapple === true) return "grapple";
      else if (hero.facingLeft === true && hero.vel.x < 0) return "jump1L";
      else if (hero.vel.y < 0) return "jump1";
      else if (
        hero.vel.y > 0 &&
        hero.collisionDirection == "NONE" &&
        hero.facingLeft == true
      )
        return "fall1L";
      else if (hero.vel.y > 0 && hero.collisionDirection == "NONE")
        return "fall1";
      else if (hero.facingLeft === true) return "idleL";
      return "idle";
    }
    hero.draw = function drawHero(context) {
      this.getEntity();
      sprite.draw(routeFrame(this), context, 0, 0);
    };

    return hero;
  });
}

module.exports = {
  createHero: createHero
};
