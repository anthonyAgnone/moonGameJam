function drawBackground(background, context, sprites) {
  background.ranges.forEach(([x1, x2, y1, y2]) => {
    for (let x = x1; x < x2; ++x) {
      for (let y = y1; y < y2; ++y) {
        sprites.drawTile(background.tile, context, x, y);
      }
    }
  });
}

function createBackgroundLayer(backgrounds, sprites) {
  const buffer = document.createElement("canvas");
  buffer.width = 1920;
  buffer.height = 1080;

  backgrounds.forEach(background => {
    drawBackground(background, buffer.getContext("2d"), sprites);
  });

  return function drawBackgroundLayer(context) {
    context.drawImage(buffer, 0, 0);
  };
}

function createStaticLayer(sprite) {
  return function drawStaticLayer(context) {
    sprite.draw("static", context, 0, 0);
  };
}

module.exports = {
  createBackgroundLayer: createBackgroundLayer,
  createStaticLayer: createStaticLayer
};
