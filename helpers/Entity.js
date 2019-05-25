const { Vec2 } = require("./math");

class Entity {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
  }
}

module.exports = Entity;
