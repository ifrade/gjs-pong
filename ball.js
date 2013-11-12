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
}

Ball.prototype.shouldStop = function () {
    let pos = this.ball.get_position();
    // Stop when the ball disappears over the side
    return this.isOver && (pos[0] + this.mySize < 0 || pos[0] > this.stage.get_width());
}

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

    if (newX <= this.playerOneX) {
        if (checkCollision(playerOneSurface)) {
            this.xdirection = this.xdirection * -1;
            this.ydirection += Math.random() < 0.5 ? -1 : 1;
        } else {
            print("is over",
                  "player X:", this.playerOneX, "ball X:", newX,
                  " y: (", playerOneSurface.ytop, playerOneSurface.ybottom, ")",
                  "ball Y: ", newY);
            this.isOver = true;
        }
    } else if (newX + this.mySize >= this.playerTwoX) {
        if (checkCollision(playerTwoSurface)) {
            this.xdirection = this.xdirection * -1;
            this.ydirection += Math.random() < 0.5 ? -1 : 1;
        } else {
            print("is over",
                  "player X:", this.playerTwoX, "ball X:", newX,
                  " y: (", playerTwoSurface.ytop, playerTwoSurface.ybottom, ")",
                  "ball Y: ", newY);
            this.isOver = true;
        }
    }
}
