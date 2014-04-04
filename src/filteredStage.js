/* jshint moz: true, camelcase: false, nomen: false */
/* global imports, print */

/*
 * While a key is pressed, GTk is emitting key-press-events continuously and one
 * key pressed shadows other keyboard events. In other words, player 1 keeps 
 * pressed a key and we don't receive events of player 2 pressing a key.
 *
 * Here we intercept and discard these repeated events, letting pass only the first
 * "press" and the "release" of each key, ignoring the "press" events in the middle
 */
const Lang = imports.lang;
const GObject = imports.gi.GObject;
const Clutter = imports.gi.Clutter;

var MAX_KEY_CODE = 256; // Although 135 highest I could find on my keyboard :)
var keyStatus = new Array(MAX_KEY_CODE);

const FilteredStage = new Lang.Class({
    Name: "FilteredStage",
    Extends: Clutter.Stage,

    _init: function () {
        this.parent();
        for (let i = 0; i < MAX_KEY_CODE; i++) {
            keyStatus[i] = 0;
        }
        this.connect("captured-event", this.captured_event);
    },

    captured_event: function (obj, event, user_data) {
        // True to stop the event... false to let it pass
        //print("captured-event", event.get_key_code(), event.type());
        let PRESS = 1; // FIXME find the proper constans in clutter
        let RELEASE = 2;
        
        if (event.type() === RELEASE) {
            keyStatus[event.get_key_code()] = 0;
            return false;
        }

        if (event.type() === PRESS) {
            if (keyStatus[event.get_key_code()] === 1) {
                // It was already pressed
                return true;
            } else {
                keyStatus[event.get_key_code()] = 1;
                return false;
            }
        }

        return false;
    }

});

/*
Clutter.init(null);
let stage = new FilteredStage();
stage.title = "Pong!";
stage.connect("destroy", Clutter.main_quit);
stage.set_background_color(new Clutter.Color({
    red: 0,
    blue: 0,
    green: 0,
    alpha: 0
}));
stage.connect("key-press-event", function (obj, event, user_data) {
    print("Pressed", event.get_key_code());
});

stage.connect("key-release-event", function (obj, event, user_data) {
    print("Released", event.get_key_code());
});

stage.show();
Clutter.main();
*/
