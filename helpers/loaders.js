function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    console.log(image);
    image.src = url;
  });
}

function loadLevel(name) {
  //   return fetch(`../levels/${name}.json`).then(r => r.json());
  return new Promise(resolve => {
    const json = require(`../levels/${name}.json`);
    resolve(json);
  });
  //   return (json = require(`../levels/${name}.json`));
}

module.exports = {
  loadImage: loadImage,
  loadLevel: loadLevel
};
