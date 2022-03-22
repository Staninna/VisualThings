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
let backgroundColor = [0, 0, 0];

// Chaos Game
let cyclesBeforeRender = 1000,
    previous,
    previousPrevious,
    percentage,
    amountPoints,
    mode,
    points,
    colors,
    current,
    choice;

// Interaction

// Functions

//
function lerp(point1, point2, divider) {
    return point1 + divider * (point2 - point1);
}

// Find midpoint between 2 points
function midPoint(point1, point2) {
    return [point1[X] + point2[X] / 2, point1[Y] + point2[Y] / 2];
}

function setup() {
    // Setup canvas
    createCanvas(width, height);
    background(backgroundColor);

    // Set variables for patterns
    mode = document.querySelector("#mode");
    mode = mode.options[mode.selectedIndex].value;
    amountPoints =
        mode === "triangle"
            ? 3
            : mode === "pentagon"
            ? 5
            : mode === "hexagon"
            ? 6
            : mode === "square"
            ? 4
            : mode === "square2"
            ? 4
            : mode === "square3"
            ? 4
            : null;

    percentage = mode === "square" ? 2 / 3 : mode === "square2" ? 2 / 3 : 0.5;

    // Get points on a circle
    points = [];
    for (let i = 0; i < amountPoints; i++) {
        let point = [
            (Math.min(...canvasSize) / 2) *
                Math.cos(((Math.PI * 2) / amountPoints) * i) +
                Math.floor(canvasSize[X] / 2),
            (Math.min(...canvasSize) / 2) *
                Math.sin(((Math.PI * 2) / amountPoints) * i) +
                Math.floor(canvasSize[Y] / 2),
        ];
        points.push(point);
    }

    // Give every slice a random color
    colors = [];
    for (let i = 0; i < amountPoints; i++) {
        let color = [random(55, 255), random(55, 255), random(55, 255)];
        colors.push(color);
    }

    // Variables for different patterns
    if (mode === "square") {
        points.push([width / 2, height / 2]);
        colors.push([random(55, 255), random(55, 255), random(55, 255)]);
    } else if (mode === "square2") {
        points.push([0, 0]);
        points.push([0, height]);
        points.push([width, 0]);
        points.push([width, height]);
        for (var i = 0; i < 4; i++) {
            colors.push([random(55, 255), random(55, 255), random(55, 255)]);
        }
    }

    // Get random current point and random "previous" point
    current = [width / 2, height / 2];
    previous = points[Math.floor(Math.random() * points.length)];
    previousPrevious = previous;
}

function draw() {
    // Cycles before screen update
    for (let i = 0; i < cyclesBeforeRender; i++) {
        // Pick random point to goto
        choice = points[Math.floor(Math.random() * points.length)];

        // Logic for different patterns
        if (mode == "pentagon" && choice == previous) {
            continue;
        } else if (mode == "hexagon") {
            let currentPosition = points.indexOf(choice) % 2 ? 1 : 0,
                previousPosition = points.indexOf(previous) % 2 ? 1 : 0;
            if (currentPosition === previousPosition) {
                continue;
            }
        } else if (mode == "square3") {
            let currentPosition = points.indexOf(choice) % 2 ? 1 : 0,
                previousPosition = points.indexOf(previous) % 2 ? 1 : 0;
            if (previous === previousPrevious) {
                if (
                    points[currentPosition] === points[previousPosition - 1] ||
                    points[currentPosition] === points[previousPosition + 1]
                ) {
                    continue;
                } else if (
                    currentPosition === points.length - 1 &&
                    (points[currentPosition] === points[currentPosition + 1] ||
                        points[currentPosition] === points[points.length - 1])
                ) {
                    continue;
                }
            }
            previousPrevious = previous;
        }

        previous = choice;

        // Calculate mid point
        current = [
            lerp(current[X], choice[X], percentage),
            lerp(current[Y], choice[Y], percentage),
        ];

        // Draw the point
        stroke(colors[points.indexOf(choice)]);
        point(current[X], current[Y]);
    }
}

// https://en.wikipedia.org/wiki/Chaos_game
