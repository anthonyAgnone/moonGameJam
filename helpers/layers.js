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
  console.log(`possible fail ${buffer.getContext("2d")}`);

  backgrounds.forEach(background => {
    drawBackground(background, buffer.getContext("2d"), sprites);
  });

  return function drawBackgroundLayer(ctx) {
    ctx.drawImage(buffer, 0, 0);
  };
}

module.exports = {
  drawBackground: drawBackground,
  createBackgroundLayer: createBackgroundLayer
};
