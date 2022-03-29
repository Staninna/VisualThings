// Variables

// Screen
let canvasSize = [400, 400],
    width = canvasSize[0],
    height = canvasSize[1];

// Coordinates indexes
let X = 0,
    Y = 1,
    Z = 2;

// Colors
let backgroundColor = [0, 0, 0],
    primaryColor = [255, 255, 255],
    insideColor = [0, 255, 0, 100],
    outsideColor = [255, 0, 0, 100];

// Approximating Pi
const radius = Math.min(...canvasSize) / 2,
    cyclesBeforeRender = 100,
    penWeight = 2;

let total = 0.0,
    circle = 0.0,
    recordPi = 0.0,
    recordText = "";

function setup() {
    // Setup canvas
    createCanvas(width, height);
    background(backgroundColor);
    result = createP("Approximated Value: ");
}

function draw() {
    translate(width / 2, height / 2);

    for (var i = 0; i < cyclesBeforeRender; i++) {
        // Trowing darts
        total++;
        let x = random(-radius, radius),
            y = random(-radius, radius);

        // calculate if dart landed in the circle
        let distance = x * x + y * y;
        if (distance < radius * radius) {
            circle++;
            stroke(insideColor);
        } else {
            stroke(outsideColor);
        }

        // Drawing the point
        point(x, y);

        // Calculating the guess
        let pi = 4 * (circle / total),
            recordDifference = Math.abs(Math.PI - recordPi),
            difference = Math.abs(Math.PI - pi);

        // Update value on screen when record is beaten
        if (difference < recordDifference) {
            recordDifference = difference;
            recordPi = pi;
            result.html(`Approximated Value: ${recordPi}`);
        }
    }
}

// TODO add recording https://editor.p5js.org/doriclaudino/sketches/LgLw5UaBr
