function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function (otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
};
