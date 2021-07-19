let hasSensorPermission = !(DeviceOrientationEvent.requestPermission || DeviceMotionEvent.requestPermission);

const W = window.innerWidth;
const H = window.innerHeight;

//render
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "1";
document.body.appendChild(canvas);

//game objects values
const game = {
    angle: 0, //keeps track of rotations
    width: window.innerWidth, //400, //window.innerWidth-20,//1200,
    height: window.innerHeight, //600, //window.innerHeight-20, //800,
}
const radius = W / 8;
let engine;
let circles;

document.getElementById("startButton").addEventListener('click', function () {
    begPermission();
    document.getElementById("info").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("info-button").style.display = "inline-block";
    document.getElementById("solid").style.display = "none";
});

function begPermission() {
    if (DeviceOrientationEvent.requestPermission) {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                hasSensorPermission = true;
                window.addEventListener('deviceorientation', handleOrientation);
                init();
            });
    }
}

function handleOrientation(event) {
    const x = event.gamma; // In degree in the range [-90,90]
    const y = event.beta; // In degree in the range [-180,180]
    const z = event.alpha; //??

    const scale = 0.03;
    engine.world.gravity.y = y * scale;
    engine.world.gravity.x = x * scale;
}

window.onresize = e => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
};

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

    circles = Composites.stack(0, 0, 3, 1, 0, 0, function (x, y) {
        return Bodies.circle(x, y, radius, {
            render: {
                restitution: 1,
                fillStyle: 'black',
            }
        });
    });

    World.add(engine.world, [circles]);

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

    // run the engine
    Engine.run(engine);
    render();
}


function render() {
    window.requestAnimationFrame(render);
    var bodies = Composite.allBodies(engine.world);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < bodies.length; i += 1) {
        ctx.beginPath();
        ctx.arc(bodies[i].position.x, bodies[i].position.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = bodies[i].render.fillStyle;
        ctx.fill();
    }
}