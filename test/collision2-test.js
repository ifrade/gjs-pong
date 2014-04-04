/*jshint moz: true, camelcase: false */
/*global imports, print*/
imports.searchPath.unshift('..');
const JSUnit = imports.jsUnit;
const CollisionEngine = imports.collision2.CollisionEngine;


function Ball(x, y, xdirection, ydirection) {
    this.x = x;
    this.y = y;
    this.xdirection = xdirection;
    this.ydirection = ydirection;
    this.width = this.height = 10;
}

function Object(x, width, y, height) {
    this.x = x;
    this.width = width;
    this.y = y;
    this.height = height;

    this.collisionCalled = false;
    this.collision = function (ball) {
        this.collisionCalled = true;
    }

    this.assertCollision = function (expected) {
        JSUnit.assert(this.collisionCalled === expected);
        return this;
    }

    this.reset = function () {
        this.collisionCalled = false;
        return this;
    }
}

/* Wall covers all x, so it is just a matter of y and direction */
function testCollision_vertical() {
    var collisionEngine = new CollisionEngine();

    var topWall = new Object(0, 640, 0, 0);
    collisionEngine.addObject(topWall, {fromBelow: true});

    var ball = new Ball(10, 10, 0, -1); // ball moving up

    [10, 5, -3].forEach(function (i) {
        ball.y = i;
        collisionEngine.run(ball);
        topWall.assertCollision(false).reset();
    });

    ball.y = 0;
    collisionEngine.run(ball);
    topWall.assertCollision(true).reset();
}

/* Object not covering all X width... check collision only in range */
function testCollision_vertical_limited_x() {
    var collisionEngine = new CollisionEngine();

    var topObstacle = new Object(100, 100, 0, 0);
    collisionEngine.addObject(topObstacle, {fromBelow: true});

    var ball = new Ball(95, 0, 0, -1); // Going up (but collision);
    collisionEngine.run(ball);
    topObstacle.assertCollision(true).reset();

    [95, 100, 105, 195, 200].forEach(function (i) {
        ball.x = i;
        collisionEngine.run(ball);
        topObstacle.assertCollision(true).reset();
    });

    [20, 89, 201].forEach(function (i) {
        ball.x = i;
        collisionEngine.run(ball);
        topObstacle.assertCollision(false).reset();
    });
}

function testCollision_vertical_direction_below() {
    var collisionEngine = new CollisionEngine();
    
    var middleObstacle = new Object(100, 100, 100, 10);
    collisionEngine.addObject(middleObstacle, {fromBelow: true});

    // Things collide when from coming from below
    var ball = new Ball(110, 120, 0, -1);
    collisionEngine.run(ball);
    middleObstacle.assertCollision(false).reset();

    ball.y = 110;
    collisionEngine.run(ball);
    middleObstacle.assertCollision(true).reset();

    ball.y = 100;
    collisionEngine.run(ball);
    middleObstacle.assertCollision(false).reset();

    // but not from the top!
    ball.ydirection = 1;
    [85, 90, 95, 100, 105, 110, 115].forEach(function (i) {
        ball.y = i;
        collisionEngine.run(ball);
        middleObstacle.assertCollision(false).reset();
    });
}

function testCollision_vertical_direction_above() {
    var collisionEngine = new CollisionEngine();
    
    var middleObstacle = new Object(100, 100, 100, 10);
    collisionEngine.addObject(middleObstacle, {fromAbove: true, 
                                               fromBelow: true});

    // Things collide when from coming from below
    var ball = new Ball(110, 120, 0, -1);
    collisionEngine.run(ball);
    middleObstacle.assertCollision(false).reset();

    ball.y = 110;
    collisionEngine.run(ball);
    middleObstacle.assertCollision(true).reset();

    ball.y = 100;
    collisionEngine.run(ball);
    middleObstacle.assertCollision(false).reset();

    // and also from the top!
    ball.ydirection = 1;
    ball.y = 90; // size 10... so it collides
    collisionEngine.run(ball);
    middleObstacle.assertCollision(true).reset();

    [85, 95, 100, 105, 110, 115].forEach(function (i) {
        ball.y = i;
        collisionEngine.run(ball);
        middleObstacle.assertCollision(false).reset();
    });
}

function testCollision_horizontal () {
    var collisionEngine = new CollisionEngine();

    var obstacle = new Object(100, 100, 100, 100);

    collisionEngine.addObject(obstacle, { fromLeft: true,
                                          fromRight: true });


    var ball = new Ball(0, 100, 1, 0);

    // Flat to the right
    ball.x = 90;
    collisionEngine.run(ball);
    obstacle.assertCollision(true).reset();

    [80, 85, 89, 91, 100, 110].forEach(function (i) {
        ball.x = i;
        collisionEngine.run(ball);
        obstacle.assertCollision(false).reset();
    });


    // Flat to right but too high or too low
    ball.x = 90;
    [80, 89, 201, 205].forEach(function(i) {
        ball.y = i;
        collisionEngine.run(ball);
        obstacle.assertCollision(false).reset();
    });

    // Flat to the left
    ball.xdirection = -1;

    ball.y = 100;
    ball.x = 200;
    collisionEngine.run(ball);
    obstacle.assertCollision(true).reset();

    [180, 189, 190, 195, 199, 201, 205].forEach(function (i) {
        ball.x = i;
        collisionEngine.run(ball);
        obstacle.assertCollision(false).reset();
    });


}


JSUnit.gjstestRun(this, JSUnit.setUp, JSUnit.tearDown);
