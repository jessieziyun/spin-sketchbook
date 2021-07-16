import * as THREE from '/third-party/three.module.js';
import {
  DeviceOrientationControls
} from '/third-party/DeviceOrientationControls.js';
import {
  ARButton
} from '/third-party/ARButton.js'

let container, camera, renderer, scene, controls;
let particles, count = 0;
const SEPARATION = 0.05,
  AMOUNTX = 500,
  AMOUNTZ = 500;
let touch = false;

document.getElementById("startButton").addEventListener('click', function () {
  init();
  animate();
  document.getElementById("info").style.display = "none";
  document.getElementById("startButton").style.display = "none";
  document.getElementById("info-button").style.display = "inline-block";
  document.getElementById("solid").style.display = "none";
});

function init() {

  container = document.querySelector("#scene-container");
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
  controls = new DeviceOrientationControls(camera);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  document.body.appendChild(ARButton.createButton(renderer));

  createLights();
  createParticles();

  window.addEventListener("resize", onWindowResize);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(
    0xddeeff, // bright sky color
    0x202020, // dim ground color
    5, // intensity
  );
  const mainLight = new THREE.DirectionalLight(0xffffff, 5);
  mainLight.position.set(10, 10, 10);
  scene.add(ambientLight, mainLight);
}

function createParticles() {
  let numParticles = AMOUNTX * AMOUNTZ;
  let positions = new Float32Array(numParticles * 3);
  let scales = new Float32Array(numParticles);
  let i = 0,
    j = 0;

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iz = 0; iz < AMOUNTZ; iz++) {
      positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
      positions[i + 1] = -0.04; // y
      positions[i + 2] = iz * SEPARATION - ((AMOUNTZ * SEPARATION) / 2); // z
      scales[j] = 0.05;
      i += 3;
      j++;
    }
  }

  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  let material = new THREE.ShaderMaterial({
    uniforms: {
      color: {
        value: new THREE.Color(0x000000)
      },
      transparent: true,
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent
  });

  material.opacity = 0.5;
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function render() {
  controls.update();
  const positions = particles.geometry.attributes.position.array;
  const scales = particles.geometry.attributes.scale.array;

  let i = 0,
    j = 0;

  for (let ix = 0; ix < AMOUNTX; ix++) {

    for (let iy = 0; iy < AMOUNTZ; iy++) {

      positions[i + 1] = (Math.sin((ix + count) * 0.5) * 0.005) +
        (Math.sin((iy + count) * 0.5) * 0.005) - 0.04;

      i += 3;
      j++;

    }

  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;

  renderer.render(scene, camera);

  count += 0.03;
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}