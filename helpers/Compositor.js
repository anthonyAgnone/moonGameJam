class Compositor {
  constructor() {
    this.layers = [];
  }

  draw(context, camera) {
    this.layers.forEach(layer => {
      layer(context, camera);
    });
  }
}

module.exports = Compositor;
