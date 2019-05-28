function drawBackground(background, context, sprites) {
  background.ranges.forEach(([x1, x2, y1, y2]) => {
    for (let x = x1; x < x2; ++x) {
      for (let y = y1; y < y2; ++y) {
        sprites.drawTile(background.tile, context, x, y);
      }
    }
  });
}

function createBackgroundLayer(backgrounds, sprites, camera) {
  const buffer = document.createElement("canvas");
  buffer.width = 22000;
  buffer.height = 2000;

  backgrounds.forEach(background => {
    drawBackground(background, buffer.getContext("2d"), sprites);
  });

  return function drawBackgroundLayer(context) {
    context.drawImage(buffer, -camera.pos.x, -camera.pos.y);
  };
}

function createStaticLayer(sprite, camera) {
  return function drawStaticLayer(context) {
    sprite.draw("static", context, 0, 0);
  };
}

function createScrollingLayer(sprite, camera) {
  return function drawScrollingLayer(context) {
    sprite.draw("scrolling", context, -camera.pos.x * 0.2, -camera.pos.y * 0.1);
  };
}

function createSpriteLayer(entity, camera) {
  const spriteBuffer = document.createElement("canvas");
  spriteBuffer.width = 200;
  spriteBuffer.height = 300;
  const spriteBufferContext = spriteBuffer.getContext("2d");
  return function drawSpriteLayer(context, camera) {
    spriteBufferContext.clearRect(0, 0, 300, 300);
    entity.draw(spriteBufferContext);
    context.drawImage(
      spriteBuffer,
      entity.pos.x - camera.pos.x,
      entity.pos.y - camera.pos.y
    );
  };
}

function createCameraLayer(cameraToDraw) {
  return function drawCameraRect(context, fromCamera) {
    context.strokeStyle = "red";
    context.beginPath();
    context.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y
    );
    // context.stroke();
  };
}

module.exports = {
  createBackgroundLayer: createBackgroundLayer,
  createStaticLayer: createStaticLayer,
  createSpriteLayer: createSpriteLayer,
  createCameraLayer: createCameraLayer,
  createScrollingLayer: createScrollingLayer
};
