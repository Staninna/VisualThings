// Variables

// Screen
let canvasSize = [440, 440],
    width = canvasSize[0],
    height = canvasSize[1];

// Coordinates indexes
let X = 0,
    Y = 1,
    Z = 2;

// Colors
let backgroundColor = [0, 0, 0],
    primaryColor = [255, 255, 255];

// Flocking Simulation
let amountBoids = 50,
    flock;

// Classes
class Boid {
    constructor(
        forge = 0.2,
        speed = 2.0,
        sight = 40,
        size = 5,
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
        this.maxForce = forge;
        this.maxSpeed = speed;

        // Sight
        this.sight = sight;

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
            total = 0;

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
            if (distance < this.sight && other != this) {
                // align
                alignSteering.add(other.velocity);

                // separation
                let difference = p5.Vector.sub(this.position, other.position);
                difference.div(distance * distance);
                separationSteering.add(difference);

                // cohesion
                cohesionSteering.add(other.position);

                total++;
            }
        }

        // Calculate the final steering
        if (total > 0) {
            // align
            alignSteering.div(total);
            alignSteering.setMag(this.maxSpeed);
            alignSteering.sub(this.velocity);
            alignSteering.limit(this.maxForce);

            // separation
            separationSteering.div(total);
            separationSteering.setMag(this.maxSpeed);
            separationSteering.sub(this.velocity);
            separationSteering.limit(this.maxForce);

            // cohesion
            cohesionSteering.div(total);
            cohesionSteering.sub(this.position);
            cohesionSteering.setMag(this.maxSpeed);
            cohesionSteering.sub(this.velocity);
            cohesionSteering.limit(this.maxForce);
        }

        steering.add(alignSteering);
        steering.add(separationSteering);
        steering.add(cohesionSteering);

        return steering;
    }

    flock(boids) {
        let steering = this.calculateFlock(boids);

        this.acceleration.add(steering);
    }

    // Draw the boid on the canvas
    draw(velocity = false, sight = false) {
        stroke(this.color);
        strokeWeight(this.size);
        point(this.position.x, this.position.y);

        // Visualize velocity
        if (velocity) {
            stroke([255, 0, 0]);
            strokeWeight(1);
            line(
                this.position.x,
                this.position.y,
                this.position.x + this.velocity.x * 10,
                this.position.y + this.velocity.y * 10,
            );
        }

        // Visualize sight
        if (sight) {
            stroke([0, 255, 0]);
            strokeWeight(1);
            ellipse(
                this.position.x - this.size / 2,
                this.position.y - this.size / 2,
                this.sight,
                this.sight,
            );
        }
    }

    // Update the position and the velocity
    updateMovement() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }
}

// Functions

function setup() {
    // Setup canvas
    createCanvas(width, height);
    background(backgroundColor);
    noFill();

    flock = [];
    for (let i = 0; i < amountBoids; i++) {
        flock.push(new Boid());
    }
}

function draw() {
    background(backgroundColor);
    for (let i = 0; i < flock.length; i++) {
        let boid = flock[i];
        boid.wrapAround();
        boid.flock(flock);
        boid.updateMovement();
        boid.draw(false, false);
    }
}
