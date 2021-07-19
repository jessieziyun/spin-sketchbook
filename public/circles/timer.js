var Engine = Matter.Engine,
    World = Matter.World,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Bodies = Matter.Bodies;

let engine;
let world;
let circles = [];
let grounds = [];
let mConstraint;

let canvas;

let timerStart;

let start = false;

document.getElementById("startButton").addEventListener('click', function () {
    document.getElementById("info").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("info-button").style.display = "inline-block";
    document.getElementById("solid").style.display = "none";
    start = true;
    timerStart = Date.now();
});

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    engine = Engine.create();
    world = engine.world;
    frameRate(30);
    //  Engine.run(engine);
    grounds.push(new Boundary(0, height / 2, 10, height));
    grounds.push(new Boundary(width, height / 2, 10, height));
    grounds.push(new Boundary(200, 0, width, 10));
    grounds.push(new Boundary(200, height, width, 10));
    World.add(world, grounds);

    let mouse = Mouse.create(canvas.elt);
    mouse.pixelRatio = pixelDensity() // for retina displays etc
    let options = {
        mouse: mouse
    }
    mConstraint = MouseConstraint.create(engine, options);
    World.add(world, mConstraint);
    circles.push(new Circle(width / 2, 0, width / 10));
}

let count = 0;

function draw() {
    background(242, 241, 241);
    const timeElapsed = Date.now() - timerStart;
    if (timeElapsed < 300000) {
        if (frameCount % 150 === 0) {
            print(++count);
            circles.push(new Circle(width / 2, 0, width / 10));
        }

    }
    Engine.update(engine);
    for (let circle of circles) {
        circle.show();
    }
    for (let ground of grounds) {
        ground.show();
    }
}

class Box {
    constructor(x, y, w, h) {
        let options = {
            friction: 0.3,
            restitution: 0.6
        };
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        stroke(255);
        fill(0);
        rect(0, 0, this.w, this.h);
        pop();
    }
}

class Circle {
    constructor(x, y, r) {
        let options = {
            friction: 0.3,
            restitution: 0.6
        };
        this.body = Bodies.circle(x, y, r, options);
        this.r = r;
        World.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        noStroke();
        fill(0);
        ellipse(0, 0, this.r * 2);
        pop();
    }
}

class Boundary {
    constructor(x, y, w, h) {
        let options = {
            friction: 0.3,
            restitution: 0.6,
            isStatic: true,
            //      angle: PI / 4
        };
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        noStroke();
        fill(242, 241, 241);
        rect(0, 0, this.w, this.h);
        pop();
    }
}