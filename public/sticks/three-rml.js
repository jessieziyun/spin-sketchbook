/*
Middle line rotates when screen is touched. Anchored in position. Camera follows device orientation.
*/

import * as THREE from '/third-party/three.module.js';

import {
    DeviceOrientationControls
} from '/third-party/DeviceOrientationControls.js';

let camera, scene, renderer, controls, middleLine;
let touch = false;

document.getElementById("startButton").addEventListener('click', function () {
    init();
    animate();
    document.getElementById("info").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("info-button").style.display = "inline-block";
    document.getElementById("solid").style.display = "none";
});

document.body.addEventListener('touchstart', () => {
    touch = true;
    console.log(touch);
}, false);

document.body.addEventListener('touchend', () => {
    touch = false;
}, false);

function init() {
    const container = document.querySelector("#scene-container");
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2f1f1);
    controls = new DeviceOrientationControls(camera);

    scene.add(new THREE.AmbientLight(0xcccccc, 0.4));

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    const lineOneGeometry = new THREE.BoxGeometry(250, 15, 15);
    const material = new THREE.MeshStandardMaterial({
        color: 0x000000
    });

    const line1 = new THREE.Mesh(lineOneGeometry, material);
    const line2 = new THREE.Mesh(lineOneGeometry, material);
    middleLine = new THREE.Mesh(lineOneGeometry, material);
    line1.position.x = 50;
    line2.position.x = -50;
    line1.rotation.setFromVector3(new THREE.Vector3(0, 0, -Math.PI / 2.5))
    line2.rotation.setFromVector3(new THREE.Vector3(0, 0, Math.PI / 2.5));
    scene.add(line1);
    scene.add(line2);
    scene.add(middleLine);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);
    controls.update();

    if (touch) {
        middleLine.rotation.x += 0.008;
        middleLine.rotation.y += 0.015;
    }
    renderer.render(scene, camera);

}