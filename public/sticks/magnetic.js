const socket = io();
let connected = false;
let usertwoLat, usertwoLong, direction;
let heading, gravPoint;

let hasSensorPermission = !(DeviceOrientationEvent.requestPermission || DeviceMotionEvent.requestPermission);

const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

// geolocation options
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

document.getElementById("startButton").addEventListener('click', function () {
    begPermission();
    document.getElementById("info").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("info-button").style.display = "inline-block";
    document.getElementById("solid").style.display = "none";
});

const W = window.innerWidth;
const H = window.innerHeight;
const D = Math.sqrt(Math.pow(W, 2) + Math.pow(H, 2)); // diagonal between centre and corner of screen

const game = {
    angle: 0, //keeps track of rotations
    width: W, //400, //window.innerWidth-20,//1200,
    height: H, //600, //window.innerHeight-20, //800,
};

let engine, stick;
let length = W * 0.6;
let width = W / 24;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "1";
document.body.appendChild(canvas);

let userLong, userLat;

function begPermission() {
    if (DeviceOrientationEvent.requestPermission) {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                hasSensorPermission = true;
                navigator.geolocation.getCurrentPosition(success, error, options);
                init();
            });
    }
}

// module aliases
const Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Bounds = Matter.Bounds,
    Vertices = Matter.Vertices,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies;

function init() {

    // create an engine
    engine = Engine.create();

    stick = Bodies.rectangle(W / 2 - length / 2, H / 2, length, width, {
        restitution: 0.2
    });

    World.add(engine.world, [stick]);

    World.add(engine.world, [
        Constraint.create({
            pointB: {
                x: -length * 0.22,
                y: 0
            },
            pointA: {
                x: W / 2,
                y: stick.position.y
            },
            bodyB: stick,
            stiffness: 1,
            length: 0,
            // damping: 0.01,
            render: {
                strokeStyle: 'transparent',
            }
        })
    ]);

    engine.world.gravity.scale = 0.02;
    engine.world.gravity.x = W / 2;
    engine.world.gravity.y = H;
    engine.world.gravity.isPoint = true;

    // run the engine
    Engine.run(engine);
    window.addEventListener('deviceorientation', handleOrientation);

    render();

    socket.on('start', data => {
        usertwoLat = data.lat;
        usertwoLong = data.long;
        direction = bearing(userLat, userLong, usertwoLat, usertwoLong);
        connected = true;
    });

    socket.on('reset', data => {
        engine.world.gravity.x = W / 2;
        engine.world.gravity.y = H;
        connected = false;
    });
}

function render() {
    window.requestAnimationFrame(render);
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "rgb(242, 241, 241)";
    ctx.fillRect(0, 0, W, H);

    // ctx.beginPath();
    // ctx.rect(20, 20, length, width);
    // ctx.fillStyle = '#000000';
    // ctx.fill();

    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(W/2 - W/32,  H / 2 - H / 5);
    ctx.lineTo(W/2 - W/4,  H / 2 + H / 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W/2 + W/32,  H / 2 - H / 5);
    ctx.lineTo(W/2 + W/4,  H / 2 + H / 5);
    ctx.stroke();

    ctx.beginPath();
    var vertices = stick.vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var j = 1; j < vertices.length; j += 1) {
        ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
    ctx.fillStyle = '#000000';
    ctx.fill();
}

const handleOrientation = (event) => {
    if (event.webkitCompassHeading) {
        // some devices don't understand "alpha" (especially IOS devices)
        heading = event.webkitCompassHeading;
    } else {
        heading = compassHeading(event.alpha, event.beta, event.gamma);
    }

    if (connected == true) {
        // const direction = bearing(userLat, userLong, usertwoLat, usertwoLong);
        gravPoint = calculateGravityPoint(heading, direction, D);
        engine.world.gravity.x = gravPoint.x;
        engine.world.gravity.y = gravPoint.y;
    }

    // document.getElementById("heading").innerHTML = Math.round(heading);
    // document.getElementById("x").innerHTML = Math.round(gravPoint.x);
    // document.getElementById("y").innerHTML = Math.round(gravPoint.y);
};

const compassHeading = (alpha, beta, gamma) => {

    // Convert degrees to radians
    const alphaRad = alpha * (Math.PI / 180);
    const betaRad = beta * (Math.PI / 180);
    const gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    const cA = Math.cos(alphaRad);
    const sA = Math.sin(alphaRad);
    const cB = Math.cos(betaRad);
    const sB = Math.sin(betaRad);
    const cG = Math.cos(gammaRad);
    const sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    const rA = -cA * sG - sA * sB * cG;
    const rB = -sA * sG + cA * sB * cG;
    const rC = -cB * cG;

    // Calculate compass heading
    let compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
        compassHeading += Math.PI;
    } else if (rA < 0) {
        compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;
};

function calculateGravityPoint(north, direction, r) {
    // north is the angle to cardinal north in degrees, 0
    // direction is the bearing between users relative to cardinal north
    north_radians = toRadians(270 - north);
    theta_radians = north_radians + direction;
    return {
        x: r * Math.cos(theta_radians) + W / 2,
        y: r * Math.sin(theta_radians) + H / 2
    }
}

function bearing(startLat, startLng, destLat, destLng) {
    // angle between two locations, takes values in degrees
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    y = Math.sin(destLng - startLng) * Math.cos(destLat);
    x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    brng = Math.atan2(y, x);
    return brng;
}

// Converts from degrees to radians.
function toRadians(degrees) {
    return degrees * Math.PI / 180;
};

function success(pos) {
    var crd = pos.coords;

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    userLat = crd.latitude;
    userLong = crd.longitude;

    const userinfo = {
        lat: userLat,
        long: userLong
    };

    socket.emit('userinfo', userinfo);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

document.addEventListener('keydown', logKey);

function logKey(e) {
    console.log("keydown");
    const userinfo = {
        lat: 51.459881,
        long: -0.176175
    };
    socket.emit('userinfo', userinfo);
}