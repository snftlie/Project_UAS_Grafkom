import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Player, PlayerController, ThirdPersonCamera } from "./player.js";
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { createLights } from "./lights.js";
// import WebGPU from 'three/addons/capabilities/WebGPU.js';
// import WebGL from 'three/addons/capabilities/WebGL.js';
// import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';

const clock = new THREE.Clock();
//setup render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow maps
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: set shadow map type
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
    new THREE.Vector3(-2, 4, 0), // kalau mau dibuat first person x = 0, tinggal rotate camera
    new THREE.Vector3(0, 0, 0)
  ),
  new PlayerController(),
  scene,
  1
);
camera.position.set(0, 0, 100); // set posisi camera tp blm arah hadapnya
camera.lookAt(-5,3,0); // set posisi kamera menghadap 0,0,0 (rotasi cameranya)

// Orbit Control
var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.minDistance = 0.2;
controls.maxDistance = 120;
controls.update();

// LIGHTING (directional,hemisphere,ambient,dll)
createLights(scene);


// // COLLISION
// const cubeTransparant2 = new THREE.BoxGeometry(3, 10,80); //ukuran bounding
// const cubeMaterial2 = new THREE.MeshPhysicalMaterial({
//   color: 0x26A69A,
//   metalness: 0.5, 
//   roughness: 0.5, 
//   transparent: true,
//   opacity: 0.3,
//   reflectivity: 5, 
//   clearcoat: 1.0, 
//   clearcoatRoughness: 0.7, 
  
// });

// const cube2 = new THREE.Mesh(cubeTransparant2, cubeMaterial2);
// cube2.position.set(0.8, 0, 27);//posisi bounding
// scene.add(cube2);


// const cube2BoundingBox = new THREE.Box3().setFromObject(cube2);

// // character
// const characterGeometry = new THREE.BoxGeometry(1, 1, 1);
// const characterMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const character = new THREE.Mesh(characterGeometry, characterMaterial);
// scene.add(character);

// const characterBoundingBox = new THREE.Box3().setFromObject(character);

// const keys = {};
// document.addEventListener('keydown', (event) => {
//   keys[event.key] = true;
// });
// document.addEventListener('keyup', (event) => {
//   keys[event.key] = false;
// });

// function updateCharacterPosition() {
//   const speed = 0.1;
//   let moved = false;

//   if (keys['ArrowUp']) {
//     character.position.z -= speed;
//     moved = true;
//   }
//   if (keys['ArrowDown']) {
//     character.position.z += speed;
//     moved = true;
//   }
//   if (keys['ArrowLeft']) {
//     character.position.x -= speed;
//     moved = true;
//   }
//   if (keys['ArrowRight']) {
//     character.position.x += speed;
//     moved = true;
//   }

//   if (moved) {
//     characterBoundingBox.setFromObject(character);

//     if (!cube2BoundingBox.containsBox(characterBoundingBox)) {
//       if (keys['ArrowUp']) character.position.z += speed;
//       if (keys['ArrowDown']) character.position.z -= speed;
//       if (keys['ArrowLeft']) character.position.x += speed;
//       if (keys['ArrowRight']) character.position.x -= speed;
//     }
//   }
// }

// FOG 
scene.fog = new THREE.FogExp2( 0xE2B2FF, 0.015 );

// OBJECTS 
//transparent bagian toko 
const cubeTransparant = new THREE.BoxGeometry(4.7, 3, 0.1);
const cubeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff00ff,
  metalness: 0.5, 
  roughness: 0.5, 
  transparent: true,
  opacity: 0.3,
  reflectivity: 5, 
  clearcoat: 1.0, 
  clearcoatRoughness: 0.7, 
});

const cube = new THREE.Mesh(cubeTransparant, cubeMaterial);
cube.position.set(5.667+1.076+1.076-0.25, 4.558, 2.095-2.095-1.995);
scene.add(cube);



//==========================================================
const onProgress = function (xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(percentComplete.toFixed(2) + "% downloaded");
  }
};

const loader = new GLTFLoader();
loader.setPath("Assets/");
loader.load("EnvironmetAsset.gltf", function (gltf) {
  const model = gltf.scene;
  renderer.compileAsync(model, camera, scene);
  model.receiveShadow = true; 
  model.castShadow = true; 
  console.log(model);
  scene.add(model);
  model.traverse(function(node){
    if(node.isMesh){
      node.castShadow = true; 
      node.receiveShadow = true;
    }
  //   if (node.material.isMeshStandardMaterial) {
  //     // Set the roughness
  //     node.material.roughness = 10; // Adjust this value as needed
  //     node.material.metalic = -50; // Adjust this value as needed
  //     node.material.needsUpdate = true;
  //     node.material.castShadow = true; 
  //     node.material.receiveShadow = true;
  // }
  })
});

loader.setPath("Car/");
loader.load("scene.gltf", function (gltf) {
  const model = gltf.scene;
  renderer.compileAsync(model, camera, scene);
  model.receiveShadow = true; 
  model.castShadow = true; 
  model.scale.setScalar(0.05/2);
  model.rotation.set(0,Math.PI/2,0);
  model.position.set(0.4,-0.2,-12);
  
  // console.log(model);
  scene.add(model);
  model.traverse(function(node){
    if(node.isMesh){
      node.castShadow = true; 
      node.receiveShadow = true;
    }
  })
});

// let robotModel = null;
// loader.setPath("Robot/");
// loader.load("scene.gltf", function (gltf) {
//   const model = gltf.scene;
//   renderer.compileAsync(model, camera, scene);
//   model.receiveShadow = true;
//   model.castShadow = true;
//   model.scale.setScalar(1);
//   model.position.set(2.3, 0, 69.7);
//   model.rotation.set(0,-Math.PI/2,0);
//   scene.add(model);
//   model.traverse(function (node) {
//     if (node.isMesh) {
//       node.castShadow = true;
//       node.receiveShadow = true;
//     }
//   });
//   robotModel = model; //buat animate naik turun
// });
// let naik = true;
// let y = 0; //posisi robot
// function updateRobot() {
//   if (robotModel) {
//     if (naik) {
//       y += 0.01; // Ubah 0.1 ke nilai yang diinginkan untuk kecepatan naik
//       if (y >= 0.5) {
//         naik = false;
//       }
//     } else {
//       y -= 0.01; // Ubah 0.1 ke nilai yang diinginkan untuk kecepatan turun
//       if (y <= 0) {
//         naik = true;
//       }
//     }
//     robotModel.position.set(2.3, y, 69.7);
//   }
// }

var time_prev = 0;
function animate(time) {
  var dt = time - time_prev;
  dt *= 0.1;

  const delta = clock.getDelta();

  // if (mixer) mixer.update(delta);
  // player.update(delta);
  // updateCharacterPosition(); //buat collision

  updateRobot();

  renderer.render(scene, camera);

  time_prev = time;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
