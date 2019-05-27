function collisionDetectProj(actor, obs, w, h, camera, deltaTime, gravity) {
  var hero = [];
  hero.pos = [];
  hero.pos.x = actor[0];
  hero.pos.y = actor[1];
  if (isNaN(hero.pos.x)) {
    return 0;
  }
  var heroSize = [];
  heroSize.width = w;
  heroSize.height = h;

  const leeway = 5;
  var collision = false;
  var collisionDirection = hero.collisionDirection;
  obs.forEach(obst => {
    obstacles = [
      obst[0],
      obst[0] + heroSize.width,
      obst[1],
      obst[1] + heroSize.height
    ];
    if (
      hero.pos.y + heroSize.height > obstacles[2] + leeway - camera.pos.y &&
      hero.pos.y < obstacles[3] - leeway - camera.pos.y &&
      hero.pos.x < obstacles[1] - leeway - camera.pos.x &&
      hero.pos.x + heroSize.width > obstacles[0] + leeway - camera.pos.x
    ) {
      collision = true;
      console.log("HIT");
      return 1;
    }
  });

  // if (collision === false) {
  //   if (hero.grapple === false) {
  //     hero.vel.y += gravity;
  //     collisionDirection = 'NONE';
  //   }
  // }
  // if (hero.stopped === true) {
  //   hero.vel.set(0, 0);
  // }
  //hero.update(deltaTime);
  //hero.collisionDirection = collisionDirection;
}

module.exports = {
  collisionDetectProj: collisionDetectProj
};
