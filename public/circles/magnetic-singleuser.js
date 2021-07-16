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
    console.log("hello");
    document.getElementById("info").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("info-button").style.display = "inline-block";
});

const W = window.innerWidth;
const H = window.innerHeight;
const D = Math.sqrt(Math.pow(W, 2) + Math.pow(H, 2)); // diagonal between centre and corner of screen

const game = {
    angle: 0, //keeps track of rotations
    width: W, //400, //window.innerWidth-20,//1200,
    height: H, //600, //window.innerHeight-20, //800,
};
const radius = 40;
let engine, circle;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "0";
document.body.appendChild(canvas);

let userLong, userLat;

function begPermission() {
    console.log("ask for permission")
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
    Bodies = Matter.Bodies;

function init() {

    // create an engine
    engine = Engine.create();

    circle = Bodies.circle(canvas.width / 2, 200, radius, {
        restitution: 0.2
    });

    World.add(engine.world, [circle]);

    const wallSettings = {
        size: 2000,
        isStatic: true,
        render: {
            restitution: 1,
            fillStyle: 'transparent',
            strokeStyle: 'transparent'
        }
    };

    World.add(engine.world, [
        Bodies.rectangle(game.width * 0.5, -wallSettings.size * 0.5, game.width, wallSettings.size, wallSettings), //top
        Bodies.rectangle(game.width * 0.5, game.height + wallSettings.size * 0.5, game.width, wallSettings.size, wallSettings), //bottom
        Bodies.rectangle(-wallSettings.size * 0.5, game.height * 0.5, wallSettings.size, game.height + wallSettings.size, wallSettings), //left
        Bodies.rectangle(game.width + wallSettings.size * 0.5, game.height * 0.5, wallSettings.size, game.height + wallSettings.size, wallSettings) //right
    ]);

    engine.world.gravity.scale = 0.002;
    engine.world.gravity.x = W / 2;
    engine.world.gravity.y = H / 2;
    engine.world.gravity.isPoint = true;

    // run the engine
    Engine.run(engine);
    window.addEventListener('deviceorientation', handleOrientation);

    render();
}

function render() {
    window.requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(242, 241, 241)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(circle.position.x, circle.position.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#000000';
    ctx.fill();
}

const handleOrientation = (event) => {
    if (event.webkitCompassHeading) {
        heading = event.webkitCompassHeading;
    } else {
        heading = compassHeading(event.alpha, event.beta, event.gamma);
    }
    const direction = bearing(userLat, userLong, 40.7128, 74.0060);
    gravPoint = calculateGravityPoint(heading, direction, D);
    engine.world.gravity.x = gravPoint.x;
    engine.world.gravity.y = gravPoint.y;
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
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}