const Lang = imports.lang;
const Clutter = imports.gi.Clutter;

const Counter = new Lang.Class({
    Name: "Counter",
    Extends: Clutter.Text,
    _init: function (staticColor) {
        this.parent();
        this.value = 0;
        this.set_text(this.value.toString());
        this.set_font_name("Monospace 50");
        let color = staticColor || Clutter.StaticColor.WHITE;
        this.set_color(Clutter.color_get_static(color));
    },

    increment: function () {
        this._set_value(this.value + 1);
    },

    reset: function () {
        this._set_value(0);
    },

    get_value: function () {
        return this.value;
    },

    _set_value: function (newValue) {
        this.value = newValue;
        this.set_text(this.value.toString());
    }
});


const LedCounter = new Lang.Class({
    Name: "LedCounter",
    Extends: Clutter.Actor,


    values: {
        0: [0,1,1,0,
            1,0,0,1,
            1,0,0,1,
            1,0,0,1,
            0,1,1,0],
           
        1: [0,0,1,0,
            0,1,1,0,
            0,0,1,0,
            0,0,1,0,
            0,0,1,0],

        2: [0,1,1,0,
            0,0,0,1,
            0,0,1,0,
            0,1,0,0,
            0,1,1,1],

        3: [0,1,1,0,
            0,0,0,1,
            0,0,1,0,
            0,0,0,1,
            0,1,1,0],

        4: [1,0,0,0,
            1,0,1,0,
            1,1,1,1,
            0,0,1,0,
            0,0,1,0],

        5: [0,1,1,1,
            0,1,0,0,
            0,1,1,1,
            0,0,0,1,
            0,1,1,0],

        6: [0,0,1,1,
            0,1,0,0,
            0,1,1,1,
            0,1,0,1,
            0,0,1,1],
        
        7: [0,1,1,1,
            0,0,0,1,
            0,0,1,0,
            0,1,0,0,
            0,1,0,0],

        8: [0,1,1,0,
            1,0,0,1,
            0,1,1,0,
            1,0,0,1,
            0,1,1,0],

        9: [0,1,1,1,
            0,1,0,1,
            0,1,1,1,
            0,0,0,1,
            0,1,1,0],
    },

    _init: function (staticColor) {
        this.parent();
        this.pixelSize = 12;
        this.leds = [];
        this.value = 0;
        
        var color = staticColor || Clutter.StaticColor.WHITE;

        for (let row = 0; row < 5; row++) {
            for (let column = 0; column < 4; column++) {
            
                var led = new Clutter.Rectangle();
                led.set_size(this.pixelSize, this.pixelSize);
                led.set_color(Clutter.color_get_static(color));
                
                led.set_position(this.pixelSize * column, this.pixelSize * row);

                led.show();

                this.leds[row * 4 + column] = led;
                this.add_actor(led);
            }
        }
        this.reset();
    },

    _set_value: function (newValue) {
        if (newValue > 9) {
            print("WOP, unsupported value in counter");
            return;
        }
        this.value = newValue;

        let matrix = this.values[newValue];
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i]) {
                this.leds[i].show();
            } else {
                this.leds[i].hide();
            }
        }
    },
    
    increment: function () {
        this._set_value(this.value + 1);
    },

    get_value: function () {
        return this.value;
    },

    reset: function () {
        this._set_value(0);
    },
});


/*
Clutter.init(null);

let stage = new Clutter.Stage();
stage.title = "Counter";
stage.connect("destroy", Clutter.main_quit);

stage.set_background_color(Clutter.color_get_static(Clutter.StaticColor.BLACK));

//stage.add_actor(text);

var counter = new Counter();
var counter2 = new Counter();
counter2.set_position(0, 100);

var ledCounter = new LedCounter();
var ledCounter2 = new LedCounter();
ledCounter.set_position(100, 0);
ledCounter2.set_position(100, 100);

stage.add_actor(counter);
stage.add_actor(counter2);
stage.add_actor(ledCounter);
stage.add_actor(ledCounter2);

stage.connect("key-press-event", function (event) {
    counter.increment();
    ledCounter.increment();
});


stage.show();

Clutter.main();
*/
