const Clutter = imports.gi.Clutter;

function Player(stage, initialX, initialY) {
    this.stick = new Clutter.Rectangle();
    this.xsize = 10;
    this.ysize = 100;
    this.stick.set_size(this.xsize, this.ysize);
    this.stick.set_position(initialX, initialY);
    this.stick.set_color(new Clutter.Color({
        red: 150,
        blue: 0,
        green: 0,
        alpha: 255
    }));

    this.stage = stage;
    this.currentDirection = 0; // 1 up, 0 stop, -1 down
    stage.add_actor(this.stick);

    this.stageDimensions = this.stage.get_size();

}

Player.prototype.set_direction = function (direction) {
    this.currentDirection = direction;
}

Player.prototype.get_direction = function () {
    return this.currentDirection;
}

Player.prototype.move = function () {
    switch (this.currentDirection) {
        case 1: this.moveUp(); break;
        case -1: this.moveDown(); break;
    }
}

Player.prototype.get_surface = function () {
    let position = this.stick.get_position();
    return {ytop: position[1], 
            ybottom: position[1] + this.ysize };
}

Player.prototype.moveUp = function() {
    let previousPos = this.stick.get_position();
    let newY = previousPos[1] - 10;
    if (newY < 10) {
        return;
    }

    this.stick.set_position(previousPos[0], newY);
}

Player.prototype.moveDown = function() {
    let previousPos = this.stick.get_position();
    let newY = previousPos[1] + 10;
    if (newY > this.stageDimensions[1] - this.ysize - 10) {
        return;
    }
    this.stick.set_position(previousPos[0], newY);
}
