const { Vec2 } = require('./math');

function drawOutline(context, x, y, w, h, camera) {
  var hero = [];
  hero.pos = [];
  hero.pos.x = x;
  hero.pos.y = y;
  var heroSize = [];
  heroSize.width = w;
  heroSize.height = h;
  context.strokeStyle = 'red';
  context.moveTo(hero.pos.x - camera.pos.x, hero.pos.y - camera.pos.y);
  context.lineTo(
    hero.pos.x + heroSize.width - camera.pos.x,
    hero.pos.y - camera.pos.y
  );
  context.lineTo(
    hero.pos.x + heroSize.width - camera.pos.x,
    hero.pos.y + heroSize.height - camera.pos.y
  );
  context.lineTo(
    hero.pos.x - camera.pos.x,
    hero.pos.y + heroSize.height - camera.pos.y
  );
  context.lineTo(hero.pos.x - camera.pos.x, hero.pos.y - camera.pos.y);
  context.stroke();
}

module.exports = {
  drawOutline: drawOutline
};
