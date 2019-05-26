class SpriteSheet {
  constructor(image, w = 16, h = 16) {
    this.image = image;
    this.width = w;
    this.height = h;
    this.tiles = new Map();
    this.names = [];
  }

  define(name, x, y, width, height) {
    const buffer = document.createElement('canvas');
    buffer.height = this.height;
    buffer.width = this.width;
    buffer
      .getContext('2d')
      .drawImage(
        this.image,
        this.width * x,
        this.height * y,
        this.width,
        this.height,
        0,
        0,
        width,
        height
      );
    this.names.push(name);
    this.tiles.set(name, buffer);
  }

  draw(name, context, x, y) {
    const buffer = this.tiles.get(name);
    context.drawImage(buffer, x, y);
  }

  drawTile(name, context, x, y) {
    this.draw(name, context, x * this.width, y * this.height);
  }
}

module.exports = SpriteSheet;
