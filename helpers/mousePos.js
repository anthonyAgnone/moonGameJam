function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x:
      ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width +
      camera.pos.x,
    y:
      ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height -
      camera.pos.y
  };
}

module.exports = {
  getMousePos: getMousePos
};
