import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import WebGPU from 'three/addons/capabilities/WebGPU.js';
// import WebGL from 'three/addons/capabilities/WebGL.js';

// import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
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
//buat kubus ijo muter" sama ada line bentuk segitiga sama kaki tanpa alas
//geometry
// const points =
// points.push(new THREE.Vector3(-1,0,0));
// points.push(new THREE.Vector3(0,1,0));
// points.push(new THREE.Vector3(1,0,0));

// var geometry = new THREE.BufferGeometry().setFromPoints(points);
// var material  = new THREE.LineBasicMaterial({color: 0xffffff});
// var line = new THREE.Line(geometry, material);
// scene.add(line);

// var geometry = new THREE.BoxGeometry(1,1,1); // lebar, tinggi, kedalaman // buat bikin objectnya
// var material = new THREE.MeshBasicMaterial({color: 0x00FF00}); // buat bikin shadernya
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// cube merah
// var points_custom = [-1,-1,1,1,-1,1,-1,1,1,-1,1,1,1,-1,1,1,1,1,1,-1,1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,1,1,-1,1,-1,-1,-1,-1,-1,1,1,-1,1,1,-1,-1,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,-1,-1,-1,1,-1,1,1,1,1,-1,-1,1,-1,1,1,1,1,1,1,-1,1,-1,-1,1,1,1,-1,1,-1,-1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1];
// var geometry = new THREE.BufferGeometry();
// geometry.setAttribute(
//   'position',
//   new THREE.BufferAttribute(new Float32Array(points_custom), 3)
// );

// var material = new THREE.MeshBasicMaterial({color: 0xFF0000});
// var custom_cube = new THREE.Mesh(geometry, material);
// scene.add(custom_cube);

// // geometry
// const object = [];
// // plane -> one side, kalo yg dibuat di uts itu two side
// {
// var planeGeo = new THREE.PlaneGeometry(40,40);
// var planeMat = new THREE.MeshPhongMaterial({
//   color : 0x888888, // pagernya ganti jd 0x
//   side: THREE.DoubleSide
// });
// var mesh = new THREE.Mesh(planeGeo,planeMat);
// mesh.rotation.x = Math.PI * -0.5; // asumsi Math.PI = 180 jd kalo dikali sama -5 jd -90 derajat
// scene.add(mesh);
// }

// //cube
// {
// var cubeGeo = new THREE.BoxGeometry(4,4,4);
// var cubeMat = new THREE.MeshPhongMaterial({
//   color : '#BAC',
//   side : THREE.DoubleSide
// });
// var mesh = new THREE.Mesh(cubeGeo,cubeMat);
// mesh.position.set(5,3.5,0);
// scene.add(mesh);
// }

// //sphere
// {
// var sphereGeo = new THREE.SphereGeometry(3,32,16);
// var sphereMat = new THREE.MeshPhongMaterial({
//   color : '#CA8'
// });
// var mesh = new THREE.Mesh(sphereGeo,sphereMat);
// mesh.position.set(-4,5,0);
// scene.add(mesh);
// }

const onProgress = function (xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(percentComplete.toFixed(2) + "% downloaded");
  }
};

// CHARACTER FBX
const a = new Map(); // Walk, Run, Idle

const loader1 = new FBXLoader();
let mixer;
loader1.load("Walking.fbx", function (object) {
  mixer = new THREE.AnimationMixer(object);

  const action = mixer.clipAction(object.animations[0]);
  a.set("walk", mixer.clipAction(object.animations[0]));
  action.play();

  object.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  object.position.set(5, 0, 0);
  object.scale.setScalar(0.01);
  scene.add(object);
});

loader1.load("Breathing Idle.fbx", function (object) {
  mixer = new THREE.AnimationMixer(object);

  const action = mixer.clipAction(object.animations[0]);
  a.set("idle", mixer.clipAction(object.animations[0]));
  action.play();

  object.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  object.scale.setScalar(0.01);
  scene.add(object);
});

// new MTLLoader()
//      .setPath( 'resources/' )
//      .load( 'magic_book_OBJ.mtl', function ( materials ) {

//       materials.preload();

//       new OBJLoader()
//        .setMaterials( materials )
//        .setPath( 'resources/' )
//        .load( 'magic_book_OBJ.obj', function ( object ) {

//         // object.position.y = - 0.95; // buat ganti posisi
//         // object.scale.setScalar( 0.01 ); // buat scaling
//         scene.add( object );

//        }, onProgress );

//      } );

const loader = new GLTFLoader();
// loader.setPath( 'coba_aset/' );//COBA
// loader.load( 'scene.gltf',function ( gltf ) {
//   const model = gltf.scene;
//   // wait until the model can be added to the scene without blocking due to shader compilation
//   renderer.compileAsync( model, camera, scene );
//   scene.add( model );
// } );

loader.setPath("EnvironmentAssets/");
loader.load("EnvironmentAssets.gltf", function (gltf) {
  const model = gltf.scene;
  renderer.compileAsync(model, camera, scene);
  scene.add(model);
});

var time_prev = 0;
function animate(time) {
  var dt = time - time_prev;
  dt *= 0.1;

  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);

  time_prev = time;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
