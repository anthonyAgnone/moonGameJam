function levelTransition(hero, camera) {
  return new Promise(r => {
    let cameraPosition = (camera.pos.x += (hero.pos.x - camera.pos.x) / 50);
    r(cameraPosition);
  });
}
module.exports = {
  levelTransition: levelTransition
};
