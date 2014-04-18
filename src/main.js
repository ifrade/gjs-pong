/*jshint moz: true, camelcase: false */
/*global imports, print*/

imports.searchPath.unshift('.');
const Clutter = imports.gi.Clutter;
const FilteredStage = imports.filteredStage.FilteredStage;
const Player = imports.player.PongPlayer;
const PlayerWidth = imports.player.PONG_STICK_WIDTH;
const Ball = imports.ball.PongBall;
const LedCounter = imports.counter.LedCounter;
const PongVWall = imports.wall.PongVWall;
const PongHWall = imports.wall.PongHWall;
const WALL_THIKNESS = imports.wall.WALL_THIKNESS;
const CollisionEngine = imports.collision2.CollisionEngine;
const SoundBox = imports.soundbox.SoundBox;

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

let collisionEngine = new CollisionEngine();
let soundbox = new SoundBox("../data/Door_Knock.wav");
//print (stage.get_width(), stage.get_height()); // 640, 480

// Player margins
let margin = 40; // Space from the left/right side
let upperLimit = 10; // Space from the top (player won't go "higher" than this)
let lowerLimit = stage.get_height() - 10; // from the bottom (player wont go "lower" than this)

let stageCenterX = stage.get_width() / 2;
let stageCenterY = stage.get_height() / 2;

// Add players, ball and counters to the stage
let playerOne = new Player(upperLimit, lowerLimit);
let playerTwo = new Player(upperLimit, lowerLimit);
playerOne.set_position(margin, 200);
playerTwo.set_position(stage.get_width() - margin - PlayerWidth, 200);
stage.add_actor(playerOne);
stage.add_actor(playerTwo);
collisionEngine.addObject(playerOne, {fromRight: true});
collisionEngine.addObject(playerTwo, {fromLeft: true});

let ball = new Ball();
stage.add_actor(ball);

let playerOneCounter = new LedCounter();
let playerTwoCounter = new LedCounter();

playerOneCounter.set_position(stageCenterX - playerOneCounter.get_width() - 30, 20);
playerTwoCounter.set_position(stageCenterX + 30, 20);
stage.add_actor(playerOneCounter);
stage.add_actor(playerTwoCounter);

// Set up game loop
let gameloop = new Clutter.Timeline({"duration": 10000, "loop": true});

// Add walls around...
// We pass the counter we want to increment on collision
let leftWall = new PongVWall(stage.get_height(), function () {
    playerTwoCounter.increment();
    gameloop.stop();
});
let rightWall = new PongVWall(stage.get_height(), function () {
    playerOneCounter.increment();
    gameloop.stop();
});

let upperWall = new PongHWall(stage.get_width());
let lowerWall = new PongHWall(stage.get_width());

// Walls have "volume", so we set the origin out of the screen
//  to make them invisible
leftWall.set_position(-1 * WALL_THIKNESS, 0);
rightWall.set_position(stage.get_width(), 0);
upperWall.set_position(0, -1 * WALL_THIKNESS);
lowerWall.set_position(0, stage.get_height());
stage.add_actor(leftWall);
stage.add_actor(rightWall);
stage.add_actor(upperWall);
stage.add_actor(lowerWall);

collisionEngine.addObject(leftWall, {fromRight: true});
collisionEngine.addObject(rightWall, {fromLeft: true});
collisionEngine.addObject(upperWall, {fromBelow: true});
collisionEngine.addObject(lowerWall, {fromAbove: true});

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

gameloop.connect('new-frame', function () {
    playerOne.move();
    playerTwo.move();
    ball.move();

    let collision = collisionEngine.run(ball);
    if (collision !== -1) {
        soundbox.pong();
    }
});

gameloop.connect('completed', function (gl, user_data) {
    ball.speed += 1;
});

// Setup keyboard interaction
stage.connect("key-press-event", function (obj, event, user_data) {
    //print("key-press-event", event.get_key_code());
    switch (event.get_key_code()) {
        case PLAYER_ONE_UP:
            playerOne.set_direction(-1);
            break;
        case PLAYER_ONE_DOWN:
            playerOne.set_direction(1);
            break;
        case PLAYER_TWO_UP:
            playerTwo.set_direction(-1);
            break;
        case PLAYER_TWO_DOWN:
            playerTwo.set_direction(1);
            break;
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
        case RESTART:
            restart_game();
            break;
    }
    return true;
});

// and... here we go!
stage.show();
gameloop.start();

Clutter.main();
