/*jshint moz: true, camelcase: false */
/*global imports */
imports.searchPath.unshift('../src');
const JSUnit = imports.jsUnit;
const CollisionEngine = imports.collision2.CollisionEngine;
const Segment = imports.collision2.Segment;

function getH() { return new Segment(this.x, this.width);  }
function getV() { return new Segment(this.y, this.height); }

function Ball(x, y, velocity_x, velocity_y) {
    this.x = x;
    this.y = y;
    this.velocity = { x: velocity_x, y: velocity_y };
    this.width = this.height = 10;

    this.getH = getH;
    this.getV = getV;
}

function StaticObject(x, width, y, height) {
    this.x = x;
    this.width = width;
    this.y = y;
    this.height = height;

    this.getH = getH;
    this.getV = getV;

    this.collisionCalled = false;
    this.collision = function (/*ball*/) {
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

    var topWall = new StaticObject(0, 640, -10, 10);
    collisionEngine.addObject(topWall, {fromBelow: true});

    var ball = new Ball(10, 10, 0, -1); // ball moving up

    [10, 5, 1].forEach(function (i) {
        ball.y = i;
        collisionEngine.run(ball);
        topWall.assertCollision(false).reset();
    });

    // Now we accept overlap
    [0, -1, -5, -9].forEach(function (i) {
        ball.y = i;
        collisionEngine.run(ball);
        topWall.assertCollision(true).reset();
    });
}

/* Object not covering all X width... check collision only in range */
function testCollision_vertical_limited_x() {
    var collisionEngine = new CollisionEngine();

    var topObstacle = new StaticObject(100, 100, -10, 10);
    collisionEngine.addObject(topObstacle, {fromBelow: true});

    var ball = new Ball(95, 0, 0, -1); // Going up (but collision);
    collisionEngine.run(ball);
    topObstacle.assertCollision(true).reset();

    // Move along X with exact match in Y
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

    var middleObstacle = new StaticObject(100, 100, 100, 10);
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
    middleObstacle.assertCollision(true).reset();

    // but not from the top!
    ball.velocity.y = 1;
    [85, 90, 95, 100, 105, 110, 115].forEach(function (i) {
        ball.y = i;
        collisionEngine.run(ball);
        middleObstacle.assertCollision(false).reset();
    });
}

function testCollision_vertical_direction_above() {
    var collisionEngine = new CollisionEngine();

    var middleObstacle = new StaticObject(100, 100, 100, 10);
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
    middleObstacle.assertCollision(true).reset();

    // and also from the top!
    ball.velocity.y = 1;
    ball.y = 85;
    collisionEngine.run(ball);
    middleObstacle.assertCollision(false).reset();

    // size 10... so in 90 already collides
    [90, 95, 99, 100, 105].forEach(function (i) {
        ball.y = i;
        collisionEngine.run(ball);
        middleObstacle.assertCollision(true).reset();
    });
    
    [111, 115].forEach(function (i) {
        ball.y = i;
        collisionEngine.run(ball);
        middleObstacle.assertCollision(false).reset();
    });
}

function testCollision_horizontal () {
    var collisionEngine = new CollisionEngine();

    var obstacle = new StaticObject(100, 100, 100, 100);

    collisionEngine.addObject(obstacle, { fromLeft: true,
                                          fromRight: true });


    var ball = new Ball(0, 100, 1, 0);

    [80, 85, 89, 201, 205].forEach(function (i) {
        ball.x = i;
        collisionEngine.run(ball);
        obstacle.assertCollision(false).reset();
    });

    // Flat to the right
    ball.x = 90;
    collisionEngine.run(ball);
    obstacle.assertCollision(true).reset();

    [90, 91, 99, 100, 115, 199].forEach(function (i) {
        ball.x = i;
        collisionEngine.run(ball);
        obstacle.assertCollision(true).reset();
    });

    // Flat to the left
    ball.velocity.x = -1;

    ball.y = 100;
    ball.x = 201;

    collisionEngine.run(ball);
    obstacle.assertCollision(false).reset();
    [200, 150, 101, 100].forEach(function (i) {
        ball.x = i;
        collisionEngine.run(ball);
        obstacle.assertCollision(true).reset();
    });

    [201, 205].forEach(function (i) {
        ball.x = i;
        collisionEngine.run(ball);
        obstacle.assertCollision(false).reset();
    });


}


JSUnit.gjstestRun(this, JSUnit.setUp, JSUnit.tearDown);
