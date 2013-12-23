/*jshint moz: true, camelcase: false */
/*global imports, print*/

imports.searchPath.unshift('.');
const Clutter = imports.gi.Clutter;
const FilteredStage = imports.filteredStage.FilteredStage;
const Player = imports.player.Player;
const Ball = imports.ball.Ball;
const LedCounter = imports.counter.LedCounter;

let PLAYER_ONE_UP = 25;   // W
let PLAYER_ONE_DOWN = 39; // S
let PLAYER_TWO_UP = 31;   // I
let PLAYER_TWO_DOWN = 45; // K
let RESTART = 27; // R

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

//print (stage.get_width(), stage.get_height()); // 640, 480
let margin = 50;

let playerOne = new Player(stage, margin, 200);
// -10 because of the size of the stick... parameter?
let playerTwo = new Player(stage, stage.get_width()-margin-10, 200);
let ball = new Ball(stage, margin + 10, stage.get_width()-margin-10);

let playerOneCounter = new LedCounter();
let playerTwoCounter = new LedCounter();

playerOneCounter.set_position((stage.get_width()/2)-playerOneCounter.get_width()-30,
                              20);
playerTwoCounter.set_position((stage.get_width()/2)+30,
                              20);
stage.add_actor(playerOneCounter);
stage.add_actor(playerTwoCounter);

stage.connect("key-press-event", function (obj, event, user_data) {
    //print("key-press-event", event.get_key_code());
    switch (event.get_key_code()) {
        case PLAYER_ONE_UP: playerOne.set_direction(1);
        break;
        case PLAYER_ONE_DOWN: playerOne.set_direction(-1);
        break;
        case PLAYER_TWO_UP: playerTwo.set_direction(1);
        break;
        case PLAYER_TWO_DOWN: playerTwo.set_direction(-1);
        break;
        default:
        return true;
    }
    return true;
});

stage.connect("key-release-event", function (obj, event, user_data) {
    //print("key-release-event", event.get_key_code());

    switch (event.get_key_code()) {
        case PLAYER_ONE_UP:
        case PLAYER_ONE_DOWN:
        playerOne.set_direction(0);
        break;
        case PLAYER_TWO_UP:
        case PLAYER_TWO_DOWN:
        playerTwo.set_direction(0);
        break;
        case RESTART: restart_game();
        default:
        return true;
    }
    return true;
});

function restart_game() {
    if (gameloop.is_playing()) {
        gameloop.stop();
    }

    if (playerOneCounter.get_value() < 9 &&
        playerTwoCounter.get_value() < 9) {
        ball.reset();
        gameloop.start();
    }
}

let gameloop = new Clutter.Timeline({"duration": 10000, "loop": true});
gameloop.connect('new-frame', function () {
    playerOne.move();
    playerTwo.move();
    ball.move(playerOne.get_surface(), playerTwo.get_surface());

    let result = ball.scored();
    if (result === 0) {
        return;
    }

    if (result === -1) {
        playerOneCounter.increment();
    } else {
        playerTwoCounter.increment();
    }
    gameloop.stop();
});

gameloop.connect('completed', function (gl, user_data) {
    ball.speed += 1;
});

stage.show();
gameloop.start();

Clutter.main();
