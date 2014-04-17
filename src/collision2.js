/*jshint moz: true, camelcase: false */
/*global imports, print*/

imports.searchPath.unshift('.');
const getV = imports.segment.getV;
const getH = imports.segment.getH;

function CollisionEngine() {
    // List of objects that can be hit from...
    this.fromAbove = [];
    this.fromBelow = [];
    this.fromLeft = [];
    this.fromRight = [];
}

CollisionEngine.prototype.addObject = function (obj, collisionPattern) {
    print("Pushing object", obj.x, obj.y, obj.width, obj.height);
    if (collisionPattern.fromLeft) {
        this.fromLeft.push(obj);
    }
    if (collisionPattern.fromRight) {
        this.fromRight.push(obj);
    }
    if (collisionPattern.fromAbove) {
        this.fromAbove.push(obj);
    }
    if (collisionPattern.fromBelow) {
        this.fromBelow.push(obj);
    }
};

// calls collision(ball) to the object it hits
// return 0 if ok,
// return -1 is one player scores
// return 1 is other player scores ?!
CollisionEngine.prototype.run = function (ball) {

    var collision = -1;

    switch (ball.ydirection) {
        case -1: // Going up
            this.fromBelow.forEach(function (obj) {
                // Top of ball === bottom object
                // && in x range
                if (getV(obj).overlap(getV(ball)) &&
                    getH(obj).overlap(getH(ball))) {
                    obj.collision(ball);
                    collision = obj.x;
                }
            });
            break;
        case 1: // Going down
            this.fromAbove.forEach(function (obj) {
                // bottom of ball === top object
                // && in x range
                if (getV(obj).overlap(getV(ball)) &&
                    getH(obj).overlap(getH(ball))) {
                    obj.collision(ball);
                    collision = obj.x;
                }
            });
            break;
        case 0: // Flat
            break;
        default:
            print("Warning, weird ball.ydirection value!?! ", ball.ydirection);

    }


    switch (ball.xdirection) {
        case -1: // Going left
            this.fromRight.forEach(function (obj) {
                // left of ball === right of object
                // && in y range
                //print("fromRight", getV(obj), "===", getV(ball));

                if (getV(obj).overlap(getV(ball)) &&
                    getH(obj).overlap(getH(ball))) {
                    obj.collision(ball);
                    collision = ball.x;
                }
            });
            break;
        case 1: // Going right
            this.fromLeft.forEach(function (obj) {
                // right of ball === left of object
                // && in y range
                //print("fromLeft", obj.x, "===", ball.x + ball.width);
                if (getV(obj).overlap(getV(ball)) &&
                    getH(obj).overlap(getH(ball))) {
                    obj.collision(ball);
                    collision = obj.x;
                }
            });
            break;
        case 0: // Not moving?
            break;
        default:
            print("Warning, weird ball.xdirection value!?! ", ball.xdirection);
    }

    return collision;
};
