class Ant {
    constructor(x, y, pixelSize, color) {
        this.x = x;
        this.y = y;
        this.pixelSize = pixelSize;
        this.color = color;
    }

    show() {
        fill(this.color);
        rect(this.x * this.pixelSize, this.y * this.pixelSize, this.pixelSize);
    }
}
