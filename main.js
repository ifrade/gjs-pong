imports.searchPath.unshift('.');
const Clutter = imports.gi.Clutter;
const Player = imports.player.Player;
const Ball = imports.ball.Ball;

let PLAYER_ONE_UP = 25;   // W
let PLAYER_ONE_DOWN = 39; // S
let PLAYER_TWO_UP = 31;   // I
let PLAYER_TWO_DOWN = 45; // K
let RESTART = 27; // R

Clutter.init(null);

let stage = new Clutter.Stage();
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

// Eat repetisions of a key
stage.connect("captured-event", function (obj, event, user_data) {
    //print("captured-event", event.get_key_code(), event.type());
    let PRESS = 1; // FIXME find the proper constans in clutter

    if (event.type() !== PRESS) {
        return false;
    }
    
    switch (event.get_key_code()) {
        case PLAYER_ONE_UP:
        case PLAYER_ONE_DOWN:
        if (playerOne.get_direction() !== 0) {
            return true;
        }
        return false;

        case PLAYER_TWO_UP:
        case PLAYER_TWO_DOWN:
        if (playerTwo.get_direction() !== 0) {
            return true;
        }

        case RESTART: return false;
        return false;
    }

    return false;
});

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
    ball.reset();
    gameloop.start();
}

let gameloop = new Clutter.Timeline({"duration": 10000, "loop": true});
gameloop.connect('new-frame', function () {
    playerOne.move();
    playerTwo.move();
    ball.move(playerOne.get_surface(), playerTwo.get_surface());
    if (ball.shouldStop()) {
        gameloop.stop();
        //Clutter.main_quit();
    }
});
gameloop.connect('completed', function (gl, user_data) {
    ball.speed += 1;
});

stage.show();
gameloop.start();

Clutter.main();
