const Clutter = imports.gi.Clutter;

function Ball(stage, playerOneX, playerTwoX) {
    this.ball = new Clutter.Rectangle();
    this.mySize = 10;
    this.ball.set_size(this.mySize, this.mySize);
    this.reset();
    this.stage = stage;
    stage.add_actor(this.ball);

    this.playerOneX = playerOneX;
    this.playerTwoX = playerTwoX;
}

Ball.prototype.reset = function () {
    this.ball.set_position(320, 240);
    this.isOver = false;

    var speed = Math.floor((Math.random() * 4)) + 3;
    this.xdirection = speed * ((Math.random() < 0.5) ? -1 : 1); // -1 left, 1 right
    this.ydirection = (Math.random() < 0.5) ? -1 : 1; // -1 down, 0 flat, 1 up
};

Ball.prototype.scored = function () {
    let pos = this.ball.get_position();
    if (!this.isOver) {
        return 0;
    }

    if (pos[0] + this.mySize < 0) {
        return 1; // Right player scored
    } else if (pos[0] > this.stage.get_width()) {
        return -1; // Left player scored
    }

    return 0;
};

Ball.prototype.move = function (playerOneSurface,
                                playerTwoSurface) {
    let previousPos = this.ball.get_position();

    let newX = previousPos[0] + this.xdirection;
    let newY = previousPos[1] + this.ydirection;
    if (newY < 0 || (newY > (this.stage.get_height() - this.mySize))) {
        this.ydirection = this.ydirection * -1;
    }

    this.ball.set_position(newX, newY);

    if (this.isOver) {
        return;
    }

    var that = this;
    // return true if collision
    function checkCollision (surface) {
        //print("checkCollision: ", newY + that.mySize, ">=", surface.ytop,
        //      " && ", newY, "<=", surface.ybottom);
        return (newY + that.mySize >= surface.ytop &&
                newY <= surface.ybottom);
    }

    function getReflectionFactor(surface) {
        var surfaceLength = surface.ybottom - surface.ytop; // surface length
        var stepLength = Math.floor(surfaceLength / 8);
        //assert(stepLength > 0, "The stick cannot be smaller than 8!");
        var collisionPoint = (newY - surface.ytop) < 0
            ? 0
            : newY - surface.ytop;

        var collisionFactor = Math.floor(collisionPoint / stepLength); // 0 => 8
        return (collisionFactor - 4);
    }

    function playerHitsBall(surface) {
        if (checkCollision(surface)) {
            that.xdirection = that.xdirection * -1;
            //print("Applying factor", );
            that.ydirection += getReflectionFactor(surface);
            return;
        }
        print("Player missed. Player Y: (", surface.ytop, surface.ybottom, ")",
              "ball Y: ", newY);

        that.isOver = true;
    }


    if (newX <= this.playerOneX) {
        playerHitsBall(playerOneSurface);
    } else if (newX + this.mySize >= this.playerTwoX) {
        playerHitsBall(playerTwoSurface);
    }
}
