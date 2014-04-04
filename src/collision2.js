/*jshint moz: true, camelcase: false */
/*global imports, print*/

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

    function segmentCollision(a, lengthA, b, lengthB) {
        //  case 1: a------
        //             b-----
        //
        //  case 2:   a-----
        //          b------
        return (((b <= a + lengthA) && (b >= a)) ||
                (b + lengthB >= a) && (b + lengthB <= a + lengthA));
    }


    switch (ball.ydirection) {
        case -1: // Going up
            this.fromBelow.forEach(function (obj) {
                // Top of ball === bottom object
                // && in x range
                if ((obj.y + obj.height) === ball.y &&
                    segmentCollision(obj.x, obj.width, ball.x, ball.width)) {
                    obj.collision(ball);
                }
            });
            break;
        case 1: // Going down
            this.fromAbove.forEach(function (obj) {
                // bottom of ball === top object
                // && in x range
                if (obj.y === (ball.y + ball.height) &&
                    segmentCollision(obj.x, obj.width, ball.x, ball.width)) {
                    obj.collision(ball);
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
                print("fromRight", obj.x + obj.width, "===", ball.x);
                if ((obj.x + obj.width) === ball.x &&
                    segmentCollision(obj.y, obj.height, ball.y, ball.height)) {
                    obj.collision(ball);
                }
            });
            break;
        case 1: // Going right
            this.fromLeft.forEach(function (obj) {
                // right of ball === left of object
                // && in y range
                print("fromLeft", obj.x, "===", ball.x + ball.width);
                if (obj.x === (ball.x + ball.width) &&
                    segmentCollision(obj.y, obj.height, ball.y, ball.height)) {
                    obj.collision(ball);
                }
            });
            break;
        case 0: // Not moving?
            break;
        default:
            print("Warning, weird ball.xdirection value!?! ", ball.xdirection);
    }

};
