/*jshint moz: true, camelcase: false, nomen: false */
/*global imports, print*/

const Lang = imports.lang;
const Clutter = imports.gi.Clutter;

const PONG_STICK_WIDTH = 10;
const PONG_STICK_HEIGHT = 100;

var PONG_STICK_MOVE_STEP = 10; // How many pixels per move action

const PongPlayer = new Lang.Class({
    Name: "PongPlayer",
    Extends: Clutter.Rectangle,

    _init: function (initialX, initialY, upperLimit, lowerLimit) {
        this.parent();
        this.xsize = PONG_STICK_WIDTH;
        this.ysize = PONG_STICK_HEIGHT;
        this.set_size(this.xsize, this.ysize);

        this.set_position(initialX, initialY);
        this.set_color(new Clutter.Color({
            red: 150,
            blue: 0,
            green: 0,
            alpha: 255
        }));

        this.currentDirection = 0;
        this.upperLimit = upperLimit;
        this.lowerLimit = lowerLimit;
    },


    // This could be done with gobject properties
    set_direction: function (direction) {
        this.currentDirection = direction;
    },

    get_direction: function () {
        return this.currentDirection;
    },

    _moveUp: function () {
        let newY = this.y - PONG_STICK_MOVE_STEP;
        // Do not escape through the top! :)
        if (newY < this.upperLimit) {
            return;
        }
        this.y = newY;
    },

    _moveDown: function () {
        let newY = this.y + 10;
        // Do not escape through the bottom!
        if (newY + this.ysize > this.lowerLimit) {
            return;
        }
        this.y = newY;
    },


    move: function () {
        switch (this.currentDirection) {
        case 1:
            this._moveUp();
            break;
        case -1:
            this._moveDown();
            break;
        }
    },

    get_surface: function () {
        let position = this.get_position();
        return {ytop: position[1],
                ybottom: position[1] + this.ysize };
    }
});
