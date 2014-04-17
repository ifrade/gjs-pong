/*jshint moz: true, camelcase: false, nomen: false */
/*global imports, print*/
const Clutter = imports.gi.Clutter;
const Lang = imports.lang;

const PONG_BALL_SIZE = 10;

const PongBall = new Lang.Class({
    Name: "PongBall",
    Extends: Clutter.Rectangle,

    _init: function () {
        this.parent();
        this.set_size(PONG_BALL_SIZE, PONG_BALL_SIZE);
        this.reset();
    },

    reset: function () {
        this.set_position(320, 240); // FIXME
        this.xdirection = (Math.random() < 0.5) ? -1 : 1;
        this.ydirection = (Math.random() < 0.5) ? -1 : 1;

        this.xspeed = 7;
        this.yspeed = 0;
    },

    move: function () {
        this.x += (this.xdirection * this.xspeed);
        this.y += (this.ydirection * this.yspeed);
    },

    x_collision: function (yfactor) {
        print("Collision when x:", this.x, "y:", this.y, " yspeed:", this.yspeed);
        this.xdirection *= -1;
        // Put here some Y randomness
        this.yspeed = 5;
    },

    y_collision: function () {
        this.ydirection *= -1;
    }

});
