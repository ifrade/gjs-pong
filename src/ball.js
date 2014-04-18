/*jshint moz: true, camelcase: false, nomen: false */
/*global imports, print*/
const Clutter = imports.gi.Clutter;
const Lang = imports.lang;

const Vector = imports.vector.Vector;
const PONG_BALL_SIZE = 10;

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function flip() {
    return Math.random() > 0.5 ? 1 : -1;
}

const PongBall = new Lang.Class({
    Name: "PongBall",
    Extends: Clutter.Rectangle,

    _init: function () {
        this.parent();
        this.set_size(PONG_BALL_SIZE, PONG_BALL_SIZE);
        this.reset();
    },

    reset: function () {
        this.pos = new Vector(320, 240); // FIXME
        this.velocity = new Vector(getRandomArbitrary(3, 5) * flip(),
                                   getRandomArbitrary(-4, 5));
        this.apply_position();
    },

    apply_position: function () {
        this.set_position(this.pos.x, this.pos.y);
    },

    move: function () {
        // Saving few instructions from using a vector:
        this.pos.add(this.velocity);
        this.apply_position();
    },

    x_collision: function (yfactor) {
        this.velocity.x *= -1;
        let n = getRandomArbitrary(2, 5); // How much does it affect to push "down" or "up"
        this.velocity.y += (yfactor * n);
    },

    y_collision: function () {
        this.velocity.y *= -1;
    }

});
