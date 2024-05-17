import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import WebGPU from 'three/addons/capabilities/WebGPU.js';
// import WebGL from 'three/addons/capabilities/WebGL.js';

// import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//setup scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

camera.position.set(0,0,100); // set posisi camera tp blm arah hadapnya 
camera.lookAt(0,0,0); // set posisi kamera menghadap 0,0,0 (rotasi cameranya)

// Orbit Control
var controls = new OrbitControls(camera,renderer.domElement);
controls.target.set(0,5,0);
// controls.minDistance = 0.2;
// 				controls.maxDistance = 10;
controls.update();

// Light 
// Directional Light
var light = new THREE.DirectionalLight(0xFFFFFF,0.5);
light.position.set(0,10,0);
light.target.position.set(-5,0,0);
scene.add(light);
scene.add(light.target);

// HEMISPHERE LIGHT => biar kyk matahari bs mantulno cahaya kann trs kita bs liat langitnya biru 
light = new THREE.HemisphereLight(0xB1E1FF,0xB97A20,0.5);
scene.add(light);

// POINT LIGHT
light = new THREE.PointLight(0xFFFF00,50);
light.position.set(0,10,0);
scene.add(light);

// SPOT LIGHT 
light = new THREE.SpotLight(0xFF0000,50);
light.position.set(10,10,0);
scene.add(light);

// AMBIENT
light = new THREE.AmbientLight( 0xFFFFFF,1); // soft white light
scene.add( light );
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

const onProgress = function ( xhr ) {
  if ( xhr.lengthComputable ) {

    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log( percentComplete.toFixed( 2 ) + '% downloaded' );
  }
};

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
loader.setPath( 'export_unreal/' );
loader.load( 'EXPORT.gltf',function ( gltf ) {
  const model = gltf.scene;
  // wait until the model can be added to the scene without blocking due to shader compilation
  renderer.compileAsync( model, camera, scene );
  scene.add( model );
} );
loader.load('asset2/asset2.gltf',function ( gltf ) {
  const model = gltf.scene;
  // wait until the model can be added to the scene without blocking due to shader compilation
  renderer.compileAsync( model, camera, scene );
  scene.add( model );
} );
// loader.setPath( 'export_unreal/asset3' );
loader.load( 'asset3/asset3.gltf',function ( gltf ) {
  const model = gltf.scene;
  // wait until the model can be added to the scene without blocking due to shader compilation
  renderer.compileAsync( model, camera, scene );
  scene.add( model );
} );
// loader.setPath( 'export_unreal/asset4' );
loader.load( 'asset4/asset4.gltf',function ( gltf ) {
  const model = gltf.scene;
  // wait until the model can be added to the scene without blocking due to shader compilation
  renderer.compileAsync( model, camera, scene );
  scene.add( model );
} );


// sun 
// var geometry = new THREE.SphereGeometry(1,12,3);
// var material = new THREE.MeshBasicMaterial({color:0xffff00});
// var sun = new THREE.Mesh(geometry, material);
// scene.add(sun);
// object.push(sun);

// // earth 
// geometry = new THREE.SphereGeometry(0.33,12,3);
// material = new THREE.MeshBasicMaterial({color:0x00aaff});
// var earth = new THREE.Mesh(geometry, material);
// scene.add(earth);
// object.push(earth);

// //geser earth ke kanan
// earth.position.x = 2;

// // moon
// geometry = new THREE.SphereGeometry(0.111,12,3);
// material = new THREE.MeshBasicMaterial({color:0x5555ff});
// var moon = new THREE.Mesh(geometry, material);
// scene.add(moon);
// object.push(moon);
// moon.position.x = 0.5;

// sun.add(earth); // biar bumi bisa ngelilingi mataharinya
// earth.add(moon);

var time_prev = 0;
function animate(time){
  var dt = time - time_prev;
  dt *= 0.1;

  // cube.rotation.x += 0.01 * dt;
  // cube.rotation.y += 0.01 * dt;
  // object.forEach((obj)=>{obj.rotation.z += dt * 0.01});

  renderer.render(scene,camera);

  time_prev = time;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);