import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Player, PlayerController, ThirdPersonCamera } from "./player.js";
// import WebGPU from 'three/addons/capabilities/WebGPU.js';
// import WebGL from 'three/addons/capabilities/WebGL.js';
// import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';

// this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//setup scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var player = new Player(
  new ThirdPersonCamera(
    camera,
    new THREE.Vector3(-5, 2, 0),
    new THREE.Vector3(0, 0, 0)
  ),
  new PlayerController(),
  scene,
  10
);

camera.position.set(0, 0, 100); // set posisi camera tp blm arah hadapnya
camera.lookAt(0, 0, 0); // set posisi kamera menghadap 0,0,0 (rotasi cameranya)

// Orbit Control
var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
// controls.minDistance = 0.2;
// 				controls.maxDistance = 10;
controls.update();

// Light
// Directional Light
var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

// HEMISPHERE LIGHT => biar kyk matahari bs mantulno cahaya kann trs kita bs liat langitnya biru
light = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.5);
scene.add(light);

// POINT LIGHT
light = new THREE.PointLight(0xffff00, 50);
light.position.set(0, 10, 0);
scene.add(light);

// SPOT LIGHT
light = new THREE.SpotLight(0xff0000, 50);
light.position.set(10, 10, 0);
scene.add(light);

// AMBIENT
light = new THREE.AmbientLight(0xffffff, 1); // soft white light
scene.add(light);

// rectangle light (buat neon)
const rectLight1 = new THREE.RectAreaLight(0xff0000, 5, 4, 10);
rectLight1.position.set(-5, 5, 5);
scene.add(rectLight1);

const onProgress = function (xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(percentComplete.toFixed(2) + "% downloaded");
  }
};

// CHARACTER FBX
// const a = new Map(); // Walk, Run, Idle

// const loader1 = new FBXLoader();
// let mixer;
// loader1.load("Walking.fbx", function (object) {
//   mixer = new THREE.AnimationMixer(object);

//   const action = mixer.clipAction(object.animations[0]);
//   a.set("walk", mixer.clipAction(object.animations[0]));
//   action.play();

//   object.traverse(function (child) {
//     if (child.isMesh) {
//       child.castShadow = true;
//       child.receiveShadow = true;
//     }
//   });

//   object.position.set(5, 0, 0);
//   object.scale.setScalar(0.01);
//   scene.add(object);
// });

// loader1.load("Breathing Idle.fbx", function (object) {
//   mixer = new THREE.AnimationMixer(object);

//   const action = mixer.clipAction(object.animations[0]);
//   a.set("idle", mixer.clipAction(object.animations[0]));
//   action.play();

//   object.traverse(function (child) {
//     if (child.isMesh) {
//       child.castShadow = true;
//       child.receiveShadow = true;
//     }
//   });

//   object.scale.setScalar(0.01);
//   scene.add(object);
// });

const loader = new GLTFLoader();
loader.setPath("Assets/");
loader.load("EnvironmetAsset.gltf", function (gltf) {
  const model = gltf.scene;
  renderer.compileAsync(model, camera, scene);
  scene.add(model);
});

var time_prev = 0;
function animate(time) {
  var dt = time - time_prev;
  dt *= 0.1;

  const delta = clock.getDelta();

  // if (mixer) mixer.update(delta);
  player.update(dt);

  renderer.render(scene, camera);

  time_prev = time;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
