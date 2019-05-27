class Vec2 {
  constructor(x, y) {
    this.set(x, y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}

function interpolate(a, b, frac) {
  // points A and B, frac between 0 and 1
  var nx = a.x + (b.x - a.x) * frac;
  var ny = a.y + (b.y - a.y) * frac;
  return { x: nx, y: ny };
}

function lerp(min, max, fraction) {
  return (max - min) * fraction + min;
}

module.exports = {
  Vec2: Vec2,
  interpolate: interpolate,
  lerp: lerp
};
