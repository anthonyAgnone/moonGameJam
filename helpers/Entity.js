const { Vec2 } = require("./math");

class Entity {
  constructor(h, w) {
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
    this.lastPos = new Vec2(0, 0);
    this.startPoint = this.pos.x;
    this.height = h;
    this.width = w;
    this.isFlying = true;
    this.isDead = false;
    this.grapplePos = new Vec2(0, 0);
    this.grapple = false;
    this.stopped = false;
    this.pausedPos = new Vec2(0, 0);
    this.pausedVel = new Vec2(0, 0);
    this.collisionDirection = "NONE";
    this.shooting = false;
    this.shootingLeft = false;
    this.facingLeft = false;
    this.shootFrame = 0;
    this.topBound = 0;
    this.dead = false;
    this.hp = 3;
    this.noKeyBinds = false;
  }
}

module.exports = Entity;
