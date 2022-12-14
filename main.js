import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setup
// 3D basics: Scene, Camera, Renderer

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

const loader = new THREE.TextureLoader();

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshLambertMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
torus.position.setX(10);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// Helpers

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

// Controls

const controls = new OrbitControls(camera, renderer.domElement);

// Stars

const starGeometry = new THREE.SphereGeometry(0.25, 24, 16);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
function addStar() {
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = new Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const bgTexture = loader.load("space.jpeg");
scene.background = bgTexture;

// Moon

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshLambertMaterial({
    map: loader.load("moon.jpeg"),
    normalMap: loader.load("normal.jpeg"),
  })
);
// moon.position.z = 30;
moon.position.setX(-10);
scene.add(moon);

// HTML scroll

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = t * -0.01 + 30;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Three.js Render loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // controls.update();

  moon.rotation.x += 0.005;

  renderer.render(scene, camera);
}

animate();
