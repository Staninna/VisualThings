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
    optionsGlobal = document.getElementById("global"),
    playOneFrame = document.getElementById("1Frame");

// Settings

// Global settings

// Color
let globalColor = document.getElementById("globalColor");

// Size
let globalSizeSlider = document.getElementById("globalSizeSlider"),
    globalSizeInput = document.getElementById("globalSizeInput"),
    globalSizeValueText = document.getElementById("globalSizeValue");

// Force
let globalForceSlider = document.getElementById("globalForceSlider"),
    globalForceInput = document.getElementById("globalForceInput"),
    globalForceValueText = document.getElementById("globalForceValue");

// Speed
let globalSpeedSlider = document.getElementById("globalSpeedSlider"),
    globalSpeedInput = document.getElementById("globalSpeedInput"),
    globalSpeedValueText = document.getElementById("globalSpeedValue");

// AlignSight
let globalAlignSightSlider = document.getElementById("globalAlignSightSlider"),
    globalAlignSightInput = document.getElementById("globalAlignSightInput"),
    globalAlignSightValueText = document.getElementById("globalAlignSightValue");

// CohesionSight
let globalCohesionSightSlider = document.getElementById("globalCohesionSightSlider"),
    globalCohesionSightInput = document.getElementById("globalCohesionSightInput"),
    globalCohesionSightValueText = document.getElementById("globalCohesionSightValue");

// SeparationSight
let globalSeparationSightSlider = document.getElementById(
        "globalSeparationSightSlider",
    ),
    globalSeparationSightInput = document.getElementById("globalSeparationSightInput"),
    globalSeparationSightValueText = document.getElementById(
        "globalSeparationSightValue",
    );

// Add custom settings

// Color
let addCustomColor = document.getElementById("addCustomColor");

// Size
let addCustomSizeSlider = document.getElementById("addCustomSizeSlider"),
    addCustomSizeInput = document.getElementById("addCustomSizeInput"),
    addCustomSizeValueText = document.getElementById("addCustomSizeValue");

// Force
let addCustomForceSlider = document.getElementById("addCustomForceSlider"),
    addCustomForceInput = document.getElementById("addCustomForceInput"),
    addCustomForceValueText = document.getElementById("addCustomForceValue");

// Speed
let addCustomSpeedSlider = document.getElementById("addCustomSpeedSlider"),
    addCustomSpeedInput = document.getElementById("addCustomSpeedInput"),
    addCustomSpeedValueText = document.getElementById("addCustomSpeedValue");

// AlignSight
let addCustomAlignSightSlider = document.getElementById("addCustomAlignSightSlider"),
    addCustomAlignSightInput = document.getElementById("addCustomAlignSightInput"),
    addCustomAlignSightValueText = document.getElementById("addCustomAlignSightValue");

// CohesionSight
let addCustomCohesionSightSlider = document.getElementById(
        "addCustomCohesionSightSlider",
    ),
    addCustomCohesionSightInput = document.getElementById(
        "addCustomCohesionSightInput",
    ),
    addCustomCohesionSightValueText = document.getElementById(
        "addCustomCohesionSightValue",
    );

// SeparationSight
let addCustomSeparationSightSlider = document.getElementById(
        "addCustomSeparationSightSlider",
    ),
    addCustomSeparationSightInput = document.getElementById(
        "addCustomSeparationSightInput",
    ),
    addCustomSeparationSightValueText = document.getElementById(
        "addCustomSeparationSightValue",
    );

// Amount
let addCustomAmountSlider = document.getElementById("addCustomAmountSlider"),
    addCustomAmountInput = document.getElementById("addCustomAmountInput"),
    addCustomAmountValueText = document.getElementById("addCustomAmountValue");

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
        playOneFrame.style.display = "";
    } else if (action === "Play") {
        loop();
        event.target.innerHTML = "Pause";
        playOneFrame.style.display = "none";
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

// Add custom boids
function addBoids() {
    let color = addCustomColor.value,
        size = rounded(addCustomSizeInput.value),
        force = rounded(addCustomForceInput.value),
        speed = rounded(addCustomSpeedInput.value),
        alignSight = rounded(addCustomAlignSightInput.value),
        cohesionSight = rounded(addCustomCohesionSightInput.value),
        separationSight = rounded(addCustomSeparationSightInput.value),
        amount = rounded(addCustomAmountInput.value);
    for (let _ = 0; _ < amount; _++) {
        let newBoid = new Boid();
        newBoid.size = size;
        newBoid.color = color;
        newBoid.force = force;
        newBoid.speed = speed;
        newBoid.alignSight = alignSight;
        newBoid.cohesionSight = cohesionSight;
        newBoid.separationSight = separationSight;
        flock.push(newBoid);
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
    let defaultValues = new Boid();

    // Global reset
    globalColor.value = defaultValues.color;
    globalSizeSlider.value = defaultValues.size;
    globalForceSlider.value = defaultValues.force;
    globalSpeedSlider.value = defaultValues.speed;
    globalAlignSightSlider.value = defaultValues.alignSight;
    globalCohesionSightSlider.value = defaultValues.cohesionSight;
    globalSeparationSightSlider.value = defaultValues.separationSight;

    globalSizeInput.value = defaultValues.size;
    globalForceInput.value = defaultValues.force;
    globalSpeedInput.value = defaultValues.speed;
    globalAlignSightInput.value = defaultValues.alignSight;
    globalCohesionSightInput.value = defaultValues.cohesionSight;
    globalSeparationSightInput.value = defaultValues.separationSight;

    globalSizeValueText.innerHTML = defaultValues.size;
    globalForceValueText.innerHTML = defaultValues.force;
    globalSpeedValueText.innerHTML = defaultValues.speed;
    globalAlignSightValueText.innerHTML = defaultValues.alignSight;
    globalCohesionSightValueText.innerHTML = defaultValues.cohesionSight;
    globalSeparationSightValueText.innerHTML = defaultValues.separationSight;

    addCustomColor.value = defaultValues.color;
    addCustomSizeSlider.value = defaultValues.size;
    addCustomForceSlider.value = defaultValues.force;
    addCustomSpeedSlider.value = defaultValues.speed;
    addCustomAmountSlider.value = amountBoids;
    addCustomAlignSightSlider.value = defaultValues.alignSight;
    addCustomCohesionSightSlider.value = defaultValues.cohesionSight;
    addCustomSeparationSightSlider.value = defaultValues.separationSight;

    addCustomSizeInput.value = defaultValues.size;
    addCustomForceInput.value = defaultValues.force;
    addCustomSpeedInput.value = defaultValues.speed;
    addCustomAmountInput.value = amountBoids;
    addCustomAlignSightInput.value = defaultValues.alignSight;
    addCustomCohesionSightInput.value = defaultValues.cohesionSight;
    addCustomSeparationSightInput.value = defaultValues.separationSight;

    addCustomSizeValueText.innerHTML = defaultValues.size;
    addCustomForceValueText.innerHTML = defaultValues.force;
    addCustomSpeedValueText.innerHTML = defaultValues.speed;
    addCustomAmountValueText.innerHTML = amountBoids;
    addCustomAlignSightValueText.innerHTML = defaultValues.alignSight;
    addCustomCohesionSightValueText.innerHTML = defaultValues.cohesionSight;
    addCustomSeparationSightValueText.innerHTML = defaultValues.separationSight;

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

// Event listener handlers

// Global settings

// Color
function globalColorEventHandler(event) {
    let globalColorValue = event.target.value;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "color", `"${globalColorValue}"`);
    }
}

// Size
function globalSizeEventHandler(event) {
    let globalSizeValue = rounded(event.target.value);
    globalSizeValueText.innerHTML = globalSizeValue;
    globalSizeSlider.value = globalSizeValue;
    globalSizeInput.value = globalSizeValue;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "size", globalSizeValue);
    }
}

// Force
function globalForceEventHandler(event) {
    let globalForceValue = rounded(event.target.value);
    globalForceValueText.innerHTML = globalForceValue;
    globalForceSlider.value = globalForceValue;
    globalForceInput.value = globalForceValue;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "force", globalForceValue);
    }
}

// Speed
function globalSpeedEventHandler(event) {
    let globalSpeedValue = rounded(event.target.value);
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
    let globalAlignSightValue = rounded(event.target.value);
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
    let globalCohesionSightValue = rounded(event.target.value);
    globalCohesionSightValueText.innerHTML = globalCohesionSightValue;
    globalCohesionSightSlider.value = globalCohesionSightValue;
    globalCohesionSightInput.value = globalCohesionSightValue;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "cohesionSight", globalCohesionSightValue);
    }
}

function globalSeparationSightEventHandler(event) {
    let globalSeparationSightValue = rounded(event.target.value);
    globalSeparationSightValueText.innerHTML = globalSeparationSightValue;
    globalSeparationSightSlider.value = globalSeparationSightValue;
    globalSeparationSightInput.value = globalSeparationSightValue;
    for (let i = 0; i < flock.length; i++) {
        boid = flock[i];
        updateBoid(boid, "separationSight", globalSeparationSightValue);
    }
}

// Add custom

// Color
function addCustomColorEventHandler(event) {
    let addCustomColorValue = event.target.value;
}

// Size
function addCustomSizeEventHandler(event) {
    let addCustomSizeValue = rounded(event.target.value);
    addCustomSizeValueText.innerHTML = addCustomSizeValue;
    addCustomSizeSlider.value = addCustomSizeValue;
    addCustomSizeInput.value = addCustomSizeValue;
}

// Force
function addCustomForceEventHandler(event) {
    let addCustomForceValue = rounded(event.target.value);
    addCustomForceValueText.innerHTML = addCustomForceValue;
    addCustomForceSlider.value = addCustomForceValue;
    addCustomForceInput.value = addCustomForceValue;
}

// Speed
function addCustomSpeedEventHandler(event) {
    let addCustomSpeedValue = rounded(event.target.value);
    addCustomSpeedValueText.innerHTML = addCustomSpeedValue;
    addCustomSpeedSlider.value = addCustomSpeedValue;
    addCustomSpeedInput.value = addCustomSpeedValue;
}

function addCustomAmountEventHandler(event) {
    let addCustomAmountValue = round(event.target.value);
    addCustomAmountValueText.innerHTML = addCustomAmountValue;
    addCustomAmountSlider.value = addCustomAmountValue;
    addCustomAmountInput.value = addCustomAmountValue;
}

// Align sight
function addCustomAlignSightEventHandler(event) {
    let addCustomAlignSightValue = rounded(event.target.value);
    addCustomAlignSightValueText.innerHTML = addCustomAlignSightValue;
    addCustomAlignSightSlider.value = addCustomAlignSightValue;
    addCustomAlignSightInput.value = addCustomAlignSightValue;
}

// Cohesion sight
function addCustomCohesionSightEventHandler(event) {
    let addCustomCohesionSightValue = rounded(event.target.value);
    addCustomCohesionSightValueText.innerHTML = addCustomCohesionSightValue;
    addCustomCohesionSightSlider.value = addCustomCohesionSightValue;
    addCustomCohesionSightInput.value = addCustomCohesionSightValue;
}

function addCustomSeparationSightEventHandler(event) {
    let addCustomSeparationSightValue = rounded(event.target.value);
    addCustomSeparationSightValueText.innerHTML = addCustomSeparationSightValue;
    addCustomSeparationSightSlider.value = addCustomSeparationSightValue;
    addCustomSeparationSightInput.value = addCustomSeparationSightValue;
}

// Code

// Event listeners

// Global settings

// Color
globalColor.addEventListener("change", (event) => globalColorEventHandler(event));

// Size
globalSizeSlider.addEventListener("change", (event) => globalSizeEventHandler(event));
globalSizeInput.addEventListener("change", (event) => globalSizeEventHandler(event));

// Force
globalForceSlider.addEventListener("change", (event) => globalForceEventHandler(event));
globalForceInput.addEventListener("change", (event) => globalForceEventHandler(event));

// Speed
globalSpeedSlider.addEventListener("change", (event) => globalSpeedEventHandler(event));
globalSpeedInput.addEventListener("change", (event) => globalSpeedEventHandler(event));

// Align sight
globalAlignSightSlider.addEventListener("change", (event) =>
    globalAlignSightEventHandler(event),
);
globalAlignSightInput.addEventListener("change", (event) =>
    globalAlignSightEventHandler(event),
);

// Cohesion sight
globalCohesionSightSlider.addEventListener("change", (event) =>
    globalCohesionSightEventHandler(event),
);
globalCohesionSightInput.addEventListener("change", (event) =>
    globalCohesionSightEventHandler(event),
);

// SeparationSight
globalSeparationSightSlider.addEventListener("change", (event) =>
    globalSeparationSightEventHandler(event),
);
globalSeparationSightInput.addEventListener("change", (event) =>
    globalSeparationSightEventHandler(event),
);

// Add custom settings

// Color
addCustomColor.addEventListener("change", (event) => addCustomColorEventHandler(event));

// Size
addCustomSizeSlider.addEventListener("change", (event) =>
    addCustomSizeEventHandler(event),
);
addCustomSizeInput.addEventListener("change", (event) =>
    addCustomSizeEventHandler(event),
);

// Force
addCustomForceSlider.addEventListener("change", (event) =>
    addCustomForceEventHandler(event),
);
addCustomForceInput.addEventListener("change", (event) =>
    addCustomForceEventHandler(event),
);

// Speed
addCustomSpeedSlider.addEventListener("change", (event) =>
    addCustomSpeedEventHandler(event),
);
addCustomSpeedInput.addEventListener("change", (event) =>
    addCustomSpeedEventHandler(event),
);

// Amount
addCustomAmountSlider.addEventListener("change", (event) =>
    addCustomAmountEventHandler(event),
);
addCustomAmountInput.addEventListener("change", (event) =>
    addCustomAmountEventHandler(event),
);

// Align sight
addCustomAlignSightSlider.addEventListener("change", (event) =>
    addCustomAlignSightEventHandler(event),
);
addCustomAlignSightInput.addEventListener("change", (event) =>
    addCustomAlignSightEventHandler(event),
);

// Cohesion sight
addCustomCohesionSightSlider.addEventListener("change", (event) =>
    addCustomCohesionSightEventHandler(event),
);
addCustomCohesionSightInput.addEventListener("change", (event) =>
    addCustomCohesionSightEventHandler(event),
);

// SeparationSight
addCustomSeparationSightSlider.addEventListener("change", (event) =>
    addCustomSeparationSightEventHandler(event),
);
addCustomSeparationSightInput.addEventListener("change", (event) =>
    addCustomSeparationSightEventHandler(event),
);

// TODO add mouse interaction (If possible)
// TODO add walls of some kind
// TODO add tile system
// TODO add parameters in the url bar ?speed=x with export button
// TODO add custom boids to groups instead of 1 flock
// TODO add recording https://editor.p5js.org/doriclaudino/sketches/LgLw5UaBr
