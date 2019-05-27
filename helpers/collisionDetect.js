function collisionDetect(hero, obs, heroSize, deltaTime, gravity, dmg) {
  const leeway = 5;
  var collision = false;
  var collisionDirection = hero.collisionDirection;
  obs.forEach(function(obstacles, index) {
    if (
      hero.pos.y + heroSize.height > obstacles[2] + leeway &&
      hero.pos.y < obstacles[3] - leeway &&
      hero.pos.x < obstacles[1] - leeway &&
      hero.pos.x + heroSize.width > obstacles[0] + leeway
    ) {
      collision = true;
      console.log(dmg[index]);
      if (dmg[index] === 'true') {
        hero.hp -= 1;
      }
      // we have hit a platform, but from what direction
      if (
        hero.pos.y < obstacles[3] - leeway &&
        hero.pos.y + heroSize.height > obstacles[2] + leeway * 2 &&
        hero.pos.x < obstacles[1] - leeway &&
        hero.pos.x > obstacles[1] - leeway * 4 &&
        hero.pos.x < obstacles[1] - leeway
      ) {
        collisionDirection = 'RIGHT';
        if (hero.grapple === true) {
          hero.stopped = true;
        } else {
          hero.vel.y = 100;
        }
        hero.pos.x = obstacles[1] - leeway;
        return;
      } else if (
        hero.pos.y < obstacles[3] - leeway &&
        hero.pos.y + heroSize.height > obstacles[2] + leeway * 2 &&
        hero.pos.x + heroSize.width > obstacles[0] + leeway &&
        hero.pos.x + heroSize.width < obstacles[0] + leeway * 4 &&
        hero.pos.x < obstacles[0] + leeway
      ) {
        collisionDirection = 'LEFT';
        if (hero.grapple === true) {
          hero.stopped = true;
        }
        hero.pos.x = obstacles[0] - heroSize.width + leeway;
        return;
      } else if (
        hero.pos.y < obstacles[3] - leeway &&
        hero.pos.y + heroSize.height > obstacles[3] - leeway &&
        hero.pos.x < obstacles[1] - leeway &&
        hero.pos.x + heroSize.width > obstacles[0] + leeway
      ) {
        collisionDirection = 'BOTTOM';
        if (hero.grapple === true) {
          hero.stopped = true;
        }
        hero.pos.y = obstacles[3] + leeway;
        if (hero.pos.x < obstacles[0] - heroSize.width / 2) {
          hero.pos.x = obstacles[0] - heroSize.width / 2;
        } else if (
          hero.pos.x + heroSize.width >
          obstacles[1] + heroSize.width / 2
        ) {
          hero.pos.x = obstacles[1] - heroSize.width / 2;
        }
        return;
      } else if (
        hero.pos.y + heroSize.height > obstacles[2] + leeway &&
        hero.pos.y < obstacles[2] + leeway &&
        hero.pos.x < obstacles[1] - leeway &&
        hero.pos.x + heroSize.width > obstacles[0] + leeway
      ) {
        collisionDirection = 'TOP';
        if (hero.grapple === true) {
          hero.stopped = true;
        }
        hero.pos.y = obstacles[2] - heroSize.height - leeway;
        // hero.topBound = obstacles[2] - heroSize.height - leeway;
        return;
      }
    }
  });
  if (collision === false) {
    if (hero.grapple === false) {
      hero.vel.y += gravity;
      collisionDirection = 'NONE';
    }
  }
  if (hero.stopped === true) {
    hero.vel.set(0, 0);
  }
  hero.update(deltaTime);
  hero.collisionDirection = collisionDirection;
}

module.exports = {
  collisionDetect: collisionDetect
};
