/*jshint moz: true, camelcase: false, nomen: false */
/*global imports, print*/
const Clutter = imports.gi.Clutter;
const Lang = imports.lang;

const WALL_THIKNESS = 40;

const PongHWall = new Lang.Class({
    Name: "PongHWall",
    Extends: Clutter.Rectangle,

    _init: function (length) {
        this.parent();
        this.set_size(length, WALL_THIKNESS);
        //this.set_color(Clutter.color_get_static(Clutter.StaticColor.GREEN));
    },

    collision: function (ball) {
        ball.y_collision();
    }
});

const PongVWall = new Lang.Class({
    Name: "PongVWall",
    Extends: Clutter.Rectangle,

    // Maybe wall should emit a signal
    //  instead of taking a reference to the counter...
    _init: function (length, onHit) {
        this.parent();
        this.onHit = onHit;
        this.set_size(WALL_THIKNESS, length);
        //this.set_color(Clutter.color_get_static(Clutter.StaticColor.GREEN));
    },

    collision: function (/*ball*/) {
        print("Collision on VWall");
        if (this.onHit) {
            this.onHit();
        }
    }
});
