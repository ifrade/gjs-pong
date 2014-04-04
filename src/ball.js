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
        /* Speed:
         *  (320 - margin - playerWith) % this.xspeed must be 0 (270 % speed = 0)
         *  (640 - 330 - margin - playerWith) % this.xspeed must be 0 -> (260 % speed = 0)
         *
         *  So we get exact collision with the players (and walls).
         *  This means that valid x speeds are: 2, 5
         */
        this.xspeed = 5;

        /* Similar reasoning on the y:
         *   (240 % speed === 0) to hit the top wall
         *   (480 - 250 % speed === 0) to hit the bottom wall
         *  This means that valid y speeds are: 2, 5
         */
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
