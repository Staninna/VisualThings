// Variables

// Screen
let canvasSize = [440, 440],
    width = canvasSize[0],
    height = canvasSize[1];

// Coordinates indexes
let X = 0,
    Y = 1;

// Colors
let backgroundColor = [0, 0, 0],
    primaryColor = [255, 255, 255];

// Flocking Simulation
let amountBoids = 350,
    flock;

// Settings interactions
let simulationContainer = document.getElementById("simulationContainer"),
    optionsGlobal = document.getElementById("global");

// Settings

// Global settings

// Forge
let globalForgeSlider = document.getElementById("globalForgeSlider"),
    globalForgeInput = document.getElementById("globalForgeInput"),
    globalForgeValue = document.getElementById("globalForgeValue");
globalForgeValue.innerHTML = round(globalForgeSlider.value);

// Speed
let globalSpeedSlider = document.getElementById("globalSpeedSlider"),
    globalSpeedInput = document.getElementById("globalSpeedInput"),
    globalSpeedValue = document.getElementById("globalSpeedValue");
globalSpeedValue.innerHTML = round(globalSpeedSlider.value);

// AlignSight
let globalAlignSlider = document.getElementById("globalAlignSlider"),
    globalAlignInput = document.getElementById("globalAlignInput"),
    globalAlignValue = document.getElementById("globalAlignValue");
globalAlignValue.innerHTML = round(globalAlignSlider.value);

// CohesionSight
let globalCohesionSlider = document.getElementById("globalCohesionSlider"),
    globalCohesionInput = document.getElementById("globalCohesionInput"),
    globalCohesionValue = document.getElementById("globalCohesionValue");
globalCohesionValue.innerHTML = round(globalCohesionSlider.value);

// SeparationSight
let globalSeparationSlider = document.getElementById("globalSeparationSlider"),
    globalSeparationInput = document.getElementById("globalSeparationInput"),
    globalSeparationValue = document.getElementById("globalSeparationValue");
globalSeparationValue.innerHTML = round(globalSeparationSlider.value);

// Size
let globalSizeSlider = document.getElementById("globalSizeSlider"),
    globalSizeInput = document.getElementById("globalSizeInput"),
    globalSizeValue = document.getElementById("globalSizeValue");
globalSizeValue.innerHTML = round(globalSizeSlider.value);

// Classes
class Boid {
    constructor(
        forge = 0.5,
        speed = 2.0,

        alignSight = 50,
        cohesionSight = 40,
        separationSight = 80,

        size = 2,
        color = [10, 211, 255],
    ) {
        // Movement variables
        this.position = createVector(
            random(0, canvasSize[X]),
            random(0, canvasSize[Y]),
        );
        this.velocity = createVector(
            random(-speed, speed),
            random(-speed, speed),
        );
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
        if (this.position.x > canvasSize[X]) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = canvasSize[X];
        }

        // Y-as wrap around
        if (this.position.y > canvasSize[Y]) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = canvasSize[Y];
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
                distance = dist(
                    this.position.x,
                    this.position.y,
                    other.position.x,
                    other.position.y,
                );

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
                    let difference = p5.Vector.sub(
                        this.position,
                        other.position,
                    );
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
        let steering = this.calculateFlock(boids);

        this.acceleration.add(steering);
    }

    // Draw the boid on the canvas
    draw(debugView = false) {
        // Show debug animations
        if (debugView) {
            strokeWeight(1);

            // Visualize velocity
            stroke([255, 0, 0]);
            line(
                this.position.x,
                this.position.y,
                this.position.x + this.velocity.x * 10,
                this.position.y + this.velocity.y * 10,
            );

            // Visualize align sight
            stroke([255, 255, 0]);
            ellipse(
                this.position.x,
                this.position.y,
                this.alignSight,
                this.alignSight,
            );

            // Visualize cohesion sight
            stroke([255, 255, 255]);
            ellipse(
                this.position.x,
                this.position.y,
                this.cohesionSight,
                this.cohesionSight,
            );

            // Visualize separation sight
            stroke([0, 255, 255]);
            ellipse(
                this.position.x,
                this.position.y,
                this.separationSight,
                this.separationSight,
            );
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
function round(number) {
    return Math.round(number * 100) / 100;
}

function setup() {
    // Setup canvas
    let canvas = createCanvas(width, height);
    canvas.parent(simulationContainer);
    background(backgroundColor);
    noFill();

    flock = [];
    for (let i = 0; i < amountBoids; i++) {
        let boid = new Boid();
        boid.size = i / 50;
        boid.alignSight = i / 3;
        boid.cohesionSight = i / 3;
        boid.separationSight = i / 3;
        boid.color = [random(0, 255), random(0, 255), random(0, 255)];
        flock.push(boid);
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
        boid.draw(false);
    }
}

// TODO add mouse interaction (If possible)
