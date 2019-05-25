const { Vec2 } = require("./math");

class Entity {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
    this.lastPos = new Vec2(0, 0);
    this.startPoint = this.pos.x;
  }
}

module.exports = Entity;
