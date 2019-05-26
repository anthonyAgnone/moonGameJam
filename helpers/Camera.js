const { Vec2 } = require("./math");

class Camera {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.size = new Vec2(100920, 1080);
  }

  setPosition(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }
}

module.exports = Camera;
