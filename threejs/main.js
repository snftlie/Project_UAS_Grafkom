import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import {
  Player,
  PlayerController,
  ThirdPersonCamera,
  FirstPersonCamera,
} from "./player.js";
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
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );

// Camera 1 (Perspective Camera)
const camera1 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera1.position.set(0, 0, 5);

// Camera 2 (Orthographic Camera)
const aspect = window.innerWidth / window.innerHeight;
const camera2 = new THREE.OrthographicCamera(
  -aspect * 5,
  aspect * 5,
  5,
  -5,
  0.1,
  1000
);
camera2.position.set(5, 5, 5);
camera2.lookAt(scene.position);

// Variable to track the current camera
let currentCamera = camera1;

// Function to switch cameras
function switchCamera() {
  const currentPosition = player.camera.position.clone();
  const currentRotation = player.camera.rotation.clone();

  if (currentCamera === camera1) {
    currentCamera = camera2;
    player.camera = currentCamera;
    PlayerController.ThirdPersonCamera = ThirdPersonCamera;
  } else {
    currentCamera = camera1;
    player.camera = currentCamera;
    PlayerController.ThirdPersonCamera = FirstPersonCamera;
  }
  // Setel ulang posisi dan rotasi pemain sesuai dengan kamera yang baru
  player.camera.position.copy(currentPosition);
  player.camera.rotation.copy(currentRotation);

  // Setel ulang lookAt ke posisi player jika menggunakan kamera orang ketiga
  if (player.camera instanceof ThirdPersonCamera) {
    player.camera.camera.lookAt(player.positionObject);
  }
}

function generateCube(dimensions, position, opacity = 0, color = 0x0000FF) {
  const geometry = new THREE.BoxGeometry(...dimensions);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    metalness: 0, 
    roughness: 0, 
    transparent: true,
    opacity: opacity,
    // opacity: 0.5,
    reflectivity: 0, 
    clearcoat: 0, 
    clearcoatRoughness: 0
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(...position);
  scene.add(cube);
  return new THREE.Box3().setFromObject(cube);
}
// // Character box
// const characterGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
// const characterMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const character = new THREE.Mesh(characterGeometry, characterMaterial);
// scene.add(character);
// const characterBoundingBox = new THREE.Box3().setFromObject(character);

// const cubeBoundingBox_ = generateCube([1.4,3.5,0.54],[4.213,5.284,0.292],0.5,0xFF00FF) 
// UKURAN, POS, OPAC, COLOR

// COLLISION 
let boundBox = [];
// Generate cubes & bounding boxes
// boundBox.push(generateCube([10, 10, 80], [-1, 0, 27])); // range jalan
boundBox.push(generateCube([5, 30, 14], [-4.5, 10, -2.4])); // kiri plg blkg 
boundBox.push(generateCube([5, 30, 8], [4.95, 10, -4.2])); // kanan plg depan
boundBox.push(generateCube([5, 30, 8], [-3.8, 10, 8.7])); // kiri blkg 2
boundBox.push(generateCube([15, 30, 41], [-11.1, 10, 32.341])); // kiri toko, lampu merah
boundBox.push(generateCube([10, 30, 23], [-10.25, 10, 63])); // kiri depan, tv
boundBox.push(generateCube([10, 30, 33], [9.443, 10, 14.010])); // kanan ke 2, hotel
boundBox.push(generateCube([10, 30, 37], [7.143, 10, 49.070])); // kanan depan
boundBox.push(generateCube([1, 2, 1], [-3.373, 0, 38.296]));  // tempat sampah
boundBox.push(generateCube([15,30,5],[0,0,-12.57]));  // BATAS UJUNG 1
boundBox.push(generateCube([7,30,3],[6,0,-9]));  // BATAS UJUNG 1 kcl 
// boundBox.push(generateCube([15,10,5],[0,0,70],0.5,0xFF00FF));  // BATAS UJUNG 2 (depan)
boundBox.push(generateCube([5,10,25],[-20.5,0,65.32],0.0,0xFF00FF));  // tambahan dlm
boundBox.push(generateCube([5,14,15],[4.6,5,70],0.0,0xFF00FF));  // tambahan dlm 2
boundBox.push(generateCube([45,14,5],[-8.38,5,79.12],0.1,0xFF00FF));  // tembok
boundBox.push(generateCube([1,2,5],[-0.75,4.218,8.73],0.0,0xFF00FF) );  // tambahan bound ngawang
boundBox.push(generateCube([10,9,9],[-6.474,11.631,43.66],0.0,0xFF00FF) );  // collision camera 1
boundBox.push(generateCube([9.1,8.68,9],[1.919,11.631,60],0.0,0xFF00FF) );  // collision camera 2
boundBox.push(generateCube([1.4,3.5,0.54],[4.213,5.284,0.292],0.0,0xFF00FF) );  // collision camera 3

// pny sharon
var player = new Player(
  new ThirdPersonCamera(
    // camera,
    currentCamera,
    new THREE.Vector3(-2, 4, 0), // kalau mau dibuat first person x = 0, tinggal rotate camera
    new THREE.Vector3(0, 0, 0)
  ),
  new PlayerController(),
  scene,
  1.0, boundBox
);
// pny feli
var player = new Player(
  new ThirdPersonCamera(
    currentCamera,
    new THREE.Vector3(0, 4, 0), // kalau mau dibuat first person x = 0, tinggal rotate camera
    new THREE.Vector3(0, 0, 0)
  ),
  scene,
  1,
  new THREE.Vector3(-20, -17, 55)
);

currentCamera.position.set(0, 0, 100); // set posisi camera tp blm arah hadapnya
currentCamera.lookAt(0, 4, 0); // set posisi kamera menghadap 0,0,0 (rotasi cameranya)

// Orbit Control
var controls = new OrbitControls(currentCamera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.minDistance = 0.2;
controls.maxDistance = 120;
controls.update();

// LIGHTING (directional,hemisphere,ambient,dll)
createLights(scene);

// FOG 
scene.fog = new THREE.FogExp2( 0xE2B2FF, 0.015 );

// OBJECTS 
//transparent bagian toko 
const cubeTransparent = new THREE.BoxGeometry(4.7, 3, 0.1);
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

const cube = new THREE.Mesh(cubeTransparent, cubeMaterial);
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
  renderer.compileAsync(model, currentCamera, scene);
  model.receiveShadow = true; 
  model.castShadow = true; 
  console.log(model);
  scene.add(model);
  model.traverse(function (node) {
    if (node.isMesh) {
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
  });
});

loader.setPath("Car/");
loader.load("scene.gltf", function (gltf) {
  const model = gltf.scene;
  renderer.compileAsync(model, currentCamera, scene);
  model.receiveShadow = true; 
  model.castShadow = true; 
  model.scale.setScalar(0.05/2.2);
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
loader.setPath("Extra/");
loader.load("scene.gltf", function (gltf) {
  const model = gltf.scene;
  renderer.compileAsync(model, camera, scene);
  model.receiveShadow = true; 
  model.castShadow = true; 
  model.scale.setScalar(1);
  model.rotation.set(0,Math.PI/2,0);
  model.position.set(-22.5,0.1,71);
  
  // console.log(model);
  scene.add(model);
  model.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
});
loader.setPath("Extra/");
loader.load("scene.gltf", function (gltf) {
  const model = gltf.scene;
  renderer.compileAsync(model, camera, scene);
  model.receiveShadow = true; 
  model.castShadow = true; 
  model.scale.setScalar(1);
  model.rotation.set(0,Math.PI/2,0);
  model.position.set(-10,0,7.5);
  
  // console.log(model);
  scene.add(model);
  model.traverse(function(node){
    if(node.isMesh){
      node.castShadow = true; 
      node.receiveShadow = true;
    }
  })
});

let robotModel = null;
loader.setPath("Robot/");
loader.load("scene.gltf", function (gltf) {
  const model = gltf.scene;
  renderer.compileAsync(model, currentCamera, scene);
  model.receiveShadow = true;
  model.castShadow = true;
  model.scale.setScalar(2.4);
  model.position.set(5, 2, 69.7);
  model.rotation.set(0,-Math.PI/2,0);
  scene.add(model);
  model.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
  robotModel = model; //buat animate naik turun
});
let naik = true;
let y = 0; //posisi robot
function updateRobot() {
  if (robotModel) {
    if (naik) {
      y += 0.02; 
      if (y >= 1) {
        naik = false;
      }
    } else {
      y -= 0.02; 
      if (y <= 0) {
        naik = true;
      }
    }
    robotModel.position.set(5, 2+y, 69.7);
  }
}

// SWITCH CAMERA pake "c"
window.addEventListener("keydown", (event) => {
  if (event.key === "c") {
    switchCamera();
  }
});

window.addEventListener("resize", () => {
  const aspect = window.innerWidth / window.innerHeight;
  camera1.aspect = aspect;
  camera1.updateProjectionMatrix();

  camera2.left = -aspect * 5;
  camera2.right = aspect * 5;
  camera2.top = 5;
  camera2.bottom = -5;
  camera2.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

var time_prev = 0;
function animate(time) {
  var dt = time - time_prev;
  dt *= 0.1;

  const delta = clock.getDelta();

  // if (mixer) mixer.update(delta);
  // player.update(delta);

  updateRobot();

  renderer.render(scene, currentCamera);

  time_prev = time;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
