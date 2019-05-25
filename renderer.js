"use strict";

/**
 * REQUIRED HELPERS
 *
 * These are helper modules – non-visual modules.
 */
const TakeScreenshotOnSpacebar = require("./helpers/take-screenshot-on-spacebar");

/**
 * REQUIRED MODULES
 *
 * Require all your modules here.
 * Modules should be in the /modules folder.
 */
const Rectangles = require("./modules/rectangles");
const Lines = require("./modules/lines");
const Dots = require("./modules/dots");
const Mario = require("./modules/mario");
const Image = require("./modules/image");
const CircleImage = require("./modules/circle-image");
const QuicksortImage = require("./modules/quicksort-image");

class Renderer {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = null;
    this.height = null;
    this.addBindings();
    this.addListeners();
    this.update();
    this.run();
    new TakeScreenshotOnSpacebar();
  }

  addBindings() {
    this.update = this.update.bind(this);
  }

  addListeners() {
    window.addEventListener("resize", this.update);
  }

  update() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  run() {
    // new Rectangles(this.canvas, this.ctx, false);
    // new Lines(this.canvas, this.ctx, false);
    // new Dots(this.canvas, this.ctx);
    new Mario(this.canvas, this.ctx);
    // new Image(this.canvas, this.ctx, false, 'img/corgi.png');
    // new Image(this.canvas, this.ctx, false, 'img/zizek.png');
    // new CircleImage(this.canvas, this.ctx, 'img/corgi.png', 0, 0, 300, 50, 59);
    // new CircleImage(this.canvas, this.ctx, 'img/corgi.png', this.width, 0, 300, 50, 59);
    // new CircleImage(this.canvas, this.ctx, 'img/corgi.png', 0, this.height, 300, 50, 59);
    // new CircleImage(this.canvas, this.ctx, 'img/corgi.png', this.width, this.height, 300, 50, 59);
    // new CircleImage(this.canvas, this.ctx, 'img/tea.png', 260, 260, 300, 80, 80);
    // new CircleImage(this.canvas, this.ctx, 'img/tea.png', this.width - 260, 260, 300, 80, 80);
    // new CircleImage(this.canvas, this.ctx, 'img/tea.png', 260, this.height - 260, 300, 80, 80);
    // new CircleImage(this.canvas, this.ctx, 'img/tea.png', this.width - 260, this.height - 260, 300, 80, 80);
    // new CircleImage(this.canvas, this.ctx, 'img/corgi.png', this.width/2, this.height/2, 300, 100, 118);
    // new QuicksortImage(this.canvas, this.ctx, 'img/cat.png');
  }
}

new Renderer();
