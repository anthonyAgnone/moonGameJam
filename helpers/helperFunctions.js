const { getMousePos } = require("./mousePos");

function setInitialPosition(hero, x, y) {
  //console.log(hero);
  hero.pos.set(x, y);
  hero.lastPos.set(x, y);
  hero.vel.set(0, 0);
}

function addKeyMapping(window, input, hero, gravity, timer) {
  input.addMapping(68, keyState => {
    if (!hero.grapple) {
      if (keyState > 0) {
        hero.vel.set(400, hero.vel.y);
        hero.facingLeft = false;
      } else hero.vel.set(0, hero.vel.y);
    }
  });

  input.addMapping(65, keyState => {
    if (!hero.grapple) {
      if (keyState > 0) {
        hero.vel.set(-400, hero.vel.y);
        hero.facingLeft = true;
      } else hero.vel.set(0, hero.vel.y);
    }
  });

  input.addMapping(32, keyState => {
    if (
      keyState > 0 &&
      (!hero.isFlying ||
        (hero.collisionDirection !== "BOTTOM" &&
          hero.collisionDirection !== "NONE"))
    )
      hero.vel.set(hero.vel.x, -900);
    else hero.vel.set(hero.vel.x, gravity);
  });

  input.addMapping(27, keyState => {
    timer.pause();
    let currentPosition = hero.pos;
    let currentVelocity = hero.vel;
    hero.pausedPos.set(currentPosition.x, currentPosition.y);
    hero.pausedVel.set(currentVelocity.x, currentVelocity.y);
  });

  input.addMapping(83, keyState => {
    hero.pos.set(hero.pausedPos.x, hero.pausedPos.y);
    hero.vel.set(hero.pausedVel.x, hero.pausedVel.y);
    timer.start();
  });
}
module.exports = {
  setInitialPosition: setInitialPosition,
  addKeyMapping: addKeyMapping
};
