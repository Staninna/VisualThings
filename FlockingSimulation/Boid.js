class Boid {
    constructor(
        force = 0.2,
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
        this.force = force;
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
        this.acceleration = createVector();
    }
}
