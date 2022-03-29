// Variables

// Screen
let canvasSize = [400, 400],
    pixelSize = 10,
    showWidth = canvasSize[0],
    showHeight = canvasSize[1],
    calcWidth = showWidth / pixelSize,
    calcHeight = showHeight / pixelSize;

// Coordinates indexes
let X = 0,
    Y = 1,
    Z = 2;

// Colors
let backgroundColor = [0, 0, 0];

// Langton's ant
let amountAnts = 1,
    ants;

// Functions

// Default P5.js functions

function setup() {
    // Setup canvas
    createCanvas(showWidth, showHeight);
    rect(0, 0, showWidth, showHeight);

    // Generate amount of ants
    ants = [];
    for (let i = 0; i < amountAnts; i++) {
        let ant = new Ant(
            floor(random(0, calcWidth)),
            floor(random(0, calcHeight)),
            pixelSize,
            [255, 0, 0],
        );
        ants.push(ant);
        ant.show();
    }
}

function draw() {}

// Wikipedia page
// https://en.wikipedia.org/wiki/Langton's_ant
