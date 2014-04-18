/*jshint moz: true, camelcase: false */
/*global imports, print*/

imports.searchPath.unshift('.');
const Rectangle = imports.gi.Clutter.Rectangle;

function sign(x) { return x ? x < 0 ? -1 : 1 : 0; }


/* Utility to represent a projection and check overlaps */
function Segment(point, length) {
    this.p = point;
    this.l = length;
}

Segment.prototype.overlap = function (other) {
        //  case 1: [this]------
        //             [other]-----
        //
        //  case 2:   [this]-----
        //          [other]------
    return (((other.p <= this.p + this.l) && (other.p >= this.p)) ||
            (other.p + other.l >= this.p) && (other.p + other.l <= this.p + this.l));
};

Segment.prototype.toString = function () {
    return "[" + this.p + "," + (this.p + this.l) + "]";
};


/* Brute-force extension of clutter rectangle to get the X (H, horizontal) and Y (V, Vertical) projections */
Rectangle.prototype.getV = function () {
    return new Segment(this.y, this.height);
};

Rectangle.prototype.getH = function () {
    return new Segment(this.x, this.width);
};


function CollisionEngine() {
    // List of objects that can be hit from...
    this.fromAbove = [];
    this.fromBelow = [];
    this.fromLeft = [];
    this.fromRight = [];
}

CollisionEngine.prototype.addObject = function (obj, collisionPattern) {
    if (!(obj instanceof Rectangle)) {
        print("[WARN] Collision engine only works with rectangles! Ignoring object.");
        // Let it pass to make testing easier
    }

    //print("Pushing object", obj.x, obj.y, obj.width, obj.height);
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

    function checkOverlap(obj) {
        if (obj.getV().overlap(ball.getV()) &&
            obj.getH().overlap(ball.getH())) {
            obj.collision(ball);
            collision = obj.x;
        }
    }

    switch (sign(ball.velocity.y)) {
        case -1: // Going up
            this.fromBelow.forEach(checkOverlap);
            break;
        case 1: // Going down
            this.fromAbove.forEach(checkOverlap);
            break;
        case 0: // Flat
            break;
        default:
            print("Warning, weird ball.ydirection value!?! ", ball.ydirection);

    }


    switch (sign(ball.velocity.x)) {
        case -1: // Going left
            this.fromRight.forEach(checkOverlap);
            break;
        case 1: // Going right
            this.fromLeft.forEach(checkOverlap);
            break;
        case 0: // Not moving?
            break;
        default:
            print("Warning, weird ball.xdirection value!?! ", ball.xdirection);
    }

    return collision;
};
