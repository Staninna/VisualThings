// Variables

// Screen
let canvasSize = [440, 440],
    width = canvasSize[0],
    height = canvasSize[1];

// Coordinates indexes
let X = 0,
    Y = 1;

// Colors
let backgroundColor = [0, 0, 0];

// Flocking Simulation
let amountBoids = 100,
    debug = false,
    flock;

// Settings interactions
let simulationContainer = document.getElementById("simulationContainer"),
    optionsGlobal = document.getElementById("global");

// Settings

// Global settings

// Color
let globalColor = document.getElementById("globalColor");

// Size
let globalSizeSlider = document.getElementById("globalSizeSlider"),
    globalSizeInput = document.getElementById("globalSizeInput"),
    globalSizeValueText = document.getElementById("globalSizeValue");
globalSizeValueText.innerHTML = rounded(globalSizeSlider.value);

// Forge
let globalForgeSlider = document.getElementById("globalForgeSlider"),
    globalForgeInput = document.getElementById("globalForgeInput"),
    globalForgeValueText = document.getElementById("globalForgeValue");
globalForgeValueText.innerHTML = rounded(globalForgeSlider.value);

// Speed
let globalSpeedSlider = document.getElementById("globalSpeedSlider"),
    globalSpeedInput = document.getElementById("globalSpeedInput"),
    globalSpeedValueText = document.getElementById("globalSpeedValue");
globalSpeedValueText.innerHTML = rounded(globalSpeedSlider.value);

// AlignSight
let globalAlignSightSlider = document.getElementById("globalAlignSightSlider"),
    globalAlignSightInput = document.getElementById("globalAlignSightInput"),
    globalAlignSightValueText = document.getElementById("globalAlignSightValue");
globalAlignSightValueText.innerHTML = rounded(globalAlignSightSlider.value);

// CohesionSight
let globalCohesionSightSlider = document.getElementById("globalCohesionSightSlider"),
    globalCohesionSightInput = document.getElementById("globalCohesionSightInput"),
    globalCohesionSightValueText = document.getElementById("globalCohesionSightValue");
globalCohesionSightValueText.innerHTML = rounded(globalCohesionSightSlider.value);

// SeparationSight
let globalSeparationSightSlider = document.getElementById("globalSeparationSightSlider"),
    globalSeparationSightInput = document.getElementById("globalSeparationSightInput"),
    globalSeparationSightValueText = document.getElementById("globalSeparationSightValue");
globalSeparationSightValueText.innerHTML = rounded(globalSeparationSightSlider.value);

// Classes
class Boid {
    constructor(
        forge = 0.2,
        speed = 2.0,

        alignSight = 50,
        cohesionSight = 50,
        separationSight = 50,

        size = 6,
        color = "#00D3FF",
    ) {
        // Movement variables
        this.position = createVector(random(0, width), random(0, height));
        this.velocity = createVector(random(-speed, speed), random(-speed, speed));
        this.acceleration = createVector();

        // Movement forges
        this.force = forge;
        this.speed = speed;

        // Sight
        this.alignSight = alignSight;
        this.cohesionSight = cohesionSight;
        this.separationSight = separationSight;

        // Appearance
        this.size = size;
        this.color = color;
    }

    // Let the boids wrap around the screen
    wrapAround() {
        // X-as wrap around
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }

        // Y-as wrap around
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    calculateFlock(boids) {
        let steering = createVector(),
            alignSteering = createVector(),
            cohesionSteering = createVector(),
            separationSteering = createVector(),
            total = 0,
            alignTotal = 0,
            cohesionTotal = 0,
            separationTotal = 0;

        // Loop over all boids in the flock
        for (let i = 0; i < boids.length; i++) {
            let other = boids[i],
                distance = dist(this.position.x, this.position.y, other.position.x, other.position.y);

            // If other boid in sight do math
            if (this != other) {
                if (distance < this.alignSight) {
                    // align
                    alignSteering.add(other.velocity);
                    alignTotal++;
                }

                // cohesion
                if (distance < this.cohesionSight) {
                    cohesionSteering.add(other.position);
                    cohesionTotal++;
                }

                // separation
                if (distance < this.separationSight) {
                    let difference = p5.Vector.sub(this.position, other.position);
                    difference.div(distance * distance);
                    separationSteering.add(difference);
                }
                total++;
            }
        }

        // Calculate the final steering
        if (total > 0) {
            // align
            if (alignTotal > 0) {
                alignSteering.div(alignTotal);
                alignSteering.setMag(this.speed);
                alignSteering.sub(this.velocity);
                alignSteering.limit(this.force);
            }

            // cohesion
            if (cohesionTotal > 0) {
                cohesionSteering.div(cohesionTotal);
                cohesionSteering.sub(this.position);
                cohesionSteering.setMag(this.speed);
                cohesionSteering.sub(this.velocity);
                cohesionSteering.limit(this.force);
            }

            if (separationTotal > 0) {
                // separation
                separationSteering.div(total);
                separationSteering.setMag(this.speed);
                separationSteering.sub(this.velocity);
                separationSteering.limit(this.force);
            }
        }

        steering.add(alignSteering);
        steering.add(cohesionSteering);
        steering.add(separationSteering);

        return steering;
    }

    flock(boids) {
        this.acceleration.add(this.calculateFlock(boids));
    }

    // Draw the boid on the canvas
    draw(debugView = false) {
        // Show debug animations
        if (debugView) {
            strokeWeight(1);

            // Visualize velocity
            stroke([255, 0, 0]);
            line(this.position.x, this.position.y, this.position.x + this.velocity.x * 10, this.position.y + this.velocity.y * 10);

            // Visualize align sight
            stroke([255, 255, 0]);
            ellipse(this.position.x, this.position.y, this.alignSight, this.alignSight);

            // Visualize cohesion sight
            stroke([255, 255, 255]);
            ellipse(this.position.x, this.position.y, this.cohesionSight, this.cohesionSight);

            // Visualize separation sight
            stroke([0, 255, 255]);
            ellipse(this.position.x, this.position.y, this.separationSight, this.separationSight);
        }

        stroke(this.color);
        strokeWeight(this.size);
        point(this.position.x, this.position.y);
    }

    // Update the position and the velocity
    updateMovement() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.speed);
        this.acceleration.mult(0);
    }
}

// Functions

// Round a number to 2 decimals
function rounded(number) {
    return Math.round(number * 100) / 100;
}

// Updates a value in a boid
function updateBoid(boid, variable, value) {
    eval(`boid.${variable} = ${value}`);
}

// Play and Pause the render in the canvas
function pauseRender(event) {
    let action = event.target.innerHTML;
    if (action === "Pause") {
        noLoop();
        event.target.innerHTML = "Play";
    } else if (action === "Play") {
        loop();
        event.target.innerHTML = "Pause";
    }
}

// Show debug visuals
function showDebug() {
    if (debug) {
        debug = false;
    } else if (!debug) {
        debug = true;
    }
}

// Event listener handlers

// Color
function globalColorEventHandler(event) {
    globalColorValue = event.target.value;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "color", `"${globalColorValue}"`);
    }
}

// Size
function globalSizeEventHandler(event) {
    globalSizeValue = rounded(event.target.value);
    globalSizeValueText.innerHTML = globalSizeValue;
    globalSizeSlider.value = globalSizeValue;
    globalSizeInput.value = globalSizeValue;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "size", globalSizeValue);
    }
}

// Forge
function globalForgeEventHandler(event) {
    globalForgeValue = rounded(event.target.value);
    globalForgeValueText.innerHTML = globalForgeValue;
    globalForgeSlider.value = globalForgeValue;
    globalForgeInput.value = globalForgeValue;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "force", globalForgeValue);
    }
}

// Speed
function globalSpeedEventHandler(event) {
    globalSpeedValue = rounded(event.target.value);
    globalSpeedValueText.innerHTML = globalSpeedValue;
    globalSpeedSlider.value = globalSpeedValue;
    globalSpeedInput.value = globalSpeedValue;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "speed", globalSpeedValue);
    }
}

// Align sight
function globalAlignSightEventHandler(event) {
    globalAlignSightValue = rounded(event.target.value);
    globalAlignSightValueText.innerHTML = globalAlignSightValue;
    globalAlignSightSlider.value = globalAlignSightValue;
    globalAlignSightInput.value = globalAlignSightValue;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "alignSight", globalAlignSightValue);
    }
}

// Cohesion sight
function globalCohesionSightEventHandler(event) {
    globalCohesionSightValue = rounded(event.target.value);
    globalCohesionSightValueText.innerHTML = globalCohesionSightValue;
    globalCohesionSightSlider.value = globalCohesionSightValue;
    globalCohesionSightInput.value = globalCohesionSightValue;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "cohesionSight", globalCohesionSightValue);
    }
}

function globalSeparationSightEventHandler(event) {
    globalSeparationSightValue = rounded(event.target.value);
    globalSeparationSightValueText.innerHTML = globalSeparationSightValue;
    globalSeparationSightSlider.value = globalSeparationSightValue;
    globalSeparationSightInput.value = globalSeparationSightValue;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "separationSight", globalSeparationSightValue);
    }
}

// Default P5.js functions

function setup() {
    // Setup canvas
    let canvas = createCanvas(width, height);
    canvas.parent(simulationContainer);
    background(backgroundColor);
    noFill();

    // Set sliders to default
    values = new Boid();
    globalColor.value = values.color;
    globalSizeSlider.value = values.size;
    globalForgeSlider.value = values.force;
    globalSpeedSlider.value = values.speed;
    globalAlignSightSlider.value = values.alignSight;
    globalCohesionSightSlider.value = values.cohesionSight;
    globalSeparationSightSlider.value = values.separationSight;

    globalSizeInput.value = values.size;
    globalForgeInput.value = values.force;
    globalSpeedInput.value = values.speed;
    globalAlignSightInput.value = values.alignSight;
    globalCohesionSightInput.value = values.cohesionSight;
    globalSeparationSightInput.value = values.separationSight;

    globalSizeValueText.innerHTML = values.size;
    globalForgeValueText.innerHTML = values.force;
    globalSpeedValueText.innerHTML = values.speed;
    globalAlignSightValueText.innerHTML = values.alignSight;
    globalCohesionSightValueText.innerHTML = values.cohesionSight;
    globalSeparationSightValueText.innerHTML = values.separationSight;

    delete values;

    // Generate a flock
    flock = [];
    for (let i = 0; i < amountBoids; i++) {
        flock.push(new Boid());
    }
}

function draw() {
    background(backgroundColor);

    // Calculate updates in movement
    for (let i = 0; i < flock.length; i++) {
        let boid = flock[i];
        boid.wrapAround();
        boid.flock(flock);
    }

    // Update and move the boids
    for (let i = 0; i < flock.length; i++) {
        let boid = flock[i];
        boid.updateMovement();
        boid.draw(debug);
    }
}

// Code

// Event listeners

// Global settings

// Color
globalColor.addEventListener("change", (event) => globalColorEventHandler(event));

// Size
globalSizeSlider.addEventListener("change", (event) => globalSizeEventHandler(event));
globalSizeInput.addEventListener("change", (event) => globalSizeEventHandler(event));

// Forge
globalForgeSlider.addEventListener("change", (event) => globalForgeEventHandler(event));
globalForgeInput.addEventListener("change", (event) => globalForgeEventHandler(event));

// Speed
globalSpeedSlider.addEventListener("change", (event) => globalSpeedEventHandler(event));
globalSpeedInput.addEventListener("change", (event) => globalSpeedEventHandler(event));

// Align sight
globalAlignSightSlider.addEventListener("change", (event) => globalAlignSightEventHandler(event));
globalAlignSightInput.addEventListener("change", (event) => globalAlignSightEventHandler(event));

// Cohesion sight
globalCohesionSightSlider.addEventListener("change", (event) => globalCohesionSightEventHandler(event));
globalCohesionSightInput.addEventListener("change", (event) => globalCohesionSightEventHandler(event));

// SeparationSight
globalSeparationSightSlider.addEventListener("change", (event) => globalSeparationSightEventHandler(event));
globalSeparationSightInput.addEventListener("change", (event) => globalSeparationSightEventHandler(event));

// TODO add mouse interaction (If possible)
// TODO add walls of some kind
// TODO add tile system
// TODO add parameters in the url bar ?speed=x with export button
// TODO add way to modify boids and add X amount of boid with X variables
