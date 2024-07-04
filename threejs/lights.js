import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

export function createLights(scene) {
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
    const addRectAreaLight = (color, intensity, width, height, position, rotation) => {
        var intens = 6; //versi normal 
        // var intens =1;//versi dim
        const light = new THREE.RectAreaLight(color, intens, width, height);
        light.position.set(...position);
        if (rotation) light.rotation.set(...rotation);
        light.castShadow = true;
        
        scene.add(light);

        // RectAreaLightHelper => garis rectanglenya 
        // const lightHelper = new RectAreaLightHelper(light);
        // scene.add(lightHelper);
    };
    function createSpotLight(color, intensity, x, y, z, targetX = 0, targetY = 0, targetZ = 0) {
        var intens = 20;
        const spotLight = new THREE.SpotLight(color, intens);
        spotLight.position.set(x, y, z);
        spotLight.target.position.set(targetX, targetY, targetZ);
        // spotLight.castShadow = true;
        scene.add(spotLight);
        scene.add(spotLight.target);
      }
      // lampu 2 dan 3 (di figma kiri atas)
      createSpotLight(0xFF0000, 250, -1.365, 3.639, -10.958, 0, 0, 0); // di figma yg kiri atas lampu2 
      createSpotLight(0xFF0000, 250, -1.387 , 3.519, 3.022, 0, 0, 0); // bawahnya
      createSpotLight(0xFF0000, 250, 7.311 , 2.892 , 2.753, 0, 0, 0); // lampu pertama yang 3 lampu
      createSpotLight(0xFF0000, 250, 8.011+2.5 , 2.892 , 2.753, 0, 0, 0); // lampu kedua yang 3 lampu
      createSpotLight(0xFF0000, 250, 12.891 , 2.892 , 2.753, 0, 0, 0); // lampu ketiga yang 3 lampu
      
      // billboard blkg 5 lampu 
      createSpotLight(0xFFFFFF, 5, 5.667, 5.778, 2.095, 5.8, 5.92, 0); // lampu 1 billboard blkg
      createSpotLight(0xFFFFFF, 5, 5.667+1.076, 5.778, 2.095, 5.8+1.1, 5.92, 0); // lampu 2 billboard blkg
      createSpotLight(0xFFFFFF, 10, 5.667+1.076+1.076, 5.778, 2.095, 5.8+1.1+1.1, 5.92, 0); // lampu 3 billboard blkg
      createSpotLight(0xFFFFFF, 10, 5.667+1.076+1.076+1.076, 5.778, 2.095, 5.8+1.1+1.1+1.1, 5.92, 0); // lampu 4 billboard blkg
      createSpotLight(0xFFFFFF, 10, 5.667+1.076+1.076+1.076+1.076, 5.778, 2.095, 5.8+1.1+1.1+1.1+1.1, 5.92, 0); // lampu 5 billboard blkg
      
      // billboard depan 5 lampu
      createSpotLight(0xFFFFFF, 5, 5.201 , 6.807 , 50.918, 0, 0, 0); // lampu 1 billboard depan 
      createSpotLight(0xFFFFFF, 5, 5.201+1.076 , 6.807 , 50.918, 0, 0, 0); // lampu 2 billboard depan
      createSpotLight(0xFFFFFF, 10, 5.201+1.076+1.076 , 6.807 , 50.918, 0, 0, 0); // lampu 3 billboard depan 
      createSpotLight(0xFFFFFF, 10, 5.201+1.076+1.076+1.706 , 6.807 , 50.918, 0, 0, 0); // lampu 4 billboard depan 
      createSpotLight(0xFFFFFF, 10, 5.201+1.076+1.076+1.706+1.706 , 6.807 , 50.918, 0, 0, 0); // lampu 5 billboard depan 
      
      // lampu neon tembok
      createSpotLight(0x26A69A, 50, 3.888 , 4.592 , 56.942, 0, -6, 56.942); // spotlight yg kiri
      createSpotLight(0x26A69A, 50, 3.888 , 4.592 , 56.942+5.182, 0, -6, 56.942+5.182); // spotlight yg kanan
      createSpotLight(0x26A69A, 50, 3.888 , 4.592-1.87 , 56.942+5.182, 0, -6+1.87, 56.942+5.182); // spotlight yg kanan bawah
      
      // lampu neon tembok vertikal
      createSpotLight(0x26A69A, 250, 4.248 , 2.359 , 48.810, 0, -2.4, 48.810); // lampu paling bawah
      createSpotLight(0x26A69A, 250, 4.248 , 2.359+1.791 , 48.810, 0, -2.4-1.791, 48.810); // lampu paling tengah
      createSpotLight(0x26A69A, 250, 4.248 , 2.359+1.791+1.791 , 48.810, 0, -2.4-1.791-1.791, 48.810); // lampu paling atas
      
      // lampu tembok yg sendirian
      createSpotLight(0xFFFFFF, 10, 7.22, 1.216, 50.810, 7.22, -1.2, 0); 
      
      // lampu neon tembok horizontal 3
      createSpotLight(0x26A69A, 250, -8.197 , 3.1 , 48.437, -8, 2.5, 48.437); // plg dpn
      createSpotLight(0x26A69A, 250, -8.197 , 3.1 , 48.437-4.391, -8, 2.5, 48.437-4.391); // plg tengah
      createSpotLight(0x26A69A, 250, -8.197 , 3.1 , 48.437-4.391-4.391, -8, 2.5, 48.437-4.391-4.391); // plg belakang
      
      // lampu neon tembok horizontal 2
      createSpotLight(0x26A69A, 250, -3.966 , 3.640 , 34.781, 0,  -3.7, 34.781); // yg lbh dpn
      createSpotLight(0x26A69A, 250, -3.966 , 3.640 , 34.781-8.081, 0,  -3.7, 34.781-8.081); // yg lbh blkg
      
      // bola lampu
      createSpotLight(0xFFFFFF, 50, 4.497, 3.150, 11.921, 4.497, -3.17, 11.921); // yg lbh blkg 
      createSpotLight(0xFFFFFF, 50, 4.497, 3.550, 11.921+5.821, 4.497, -3.6, 11.921+5.821); // yg lbh dpn 
      
     // neon light dr blkg 
      createSpotLight(0xFFFFFF, 50, 2.958, 3.883, -5.521, -3,  -3.9, 5.321);// 1 (plg blkg)
      createSpotLight(0xFFFFFF, 50, 4.923, 3.004, -1.422, 0,  -3.1, 1.5);// 2
      createSpotLight(0x0000FF, 350, 3.822, 3.580, 10.404, 0,  -3.9, 9.4);// 3

// RECTANGLE LIGHT 
    // 1 biru panjang
    addRectAreaLight(
        0x0000FF, 7, 1, 7, //0xffffff, intensity, w,h 
        [-4.511, 11.9, 13.877], //pos xyz
        [0, Math.PI, 0] //rotate xyz
    );
    addRectAreaLight(
        0x0000FF, 7, 1, 7, //wrn, intensity, w, h
        [-4.511, 11.9, 13.877-0.2] //pos xyz
    );
    // 2 kuning kotak 
    addRectAreaLight(
        0xFFFF00, 5, 0.95, 3, //wrn, intensity, w, h
        [4.145, 5.352, 0.448] //pos xyz
    );
    // 3 panah miring peach
    addRectAreaLight(
        0xFDAA91, 10, 0.95, 2.4, //wrn, intensity, w, h
        [-1.290, 6.806, 7.257], //pos xyz
        [0, 0, Math.PI / 10] //rotate xyz
    );
    // 4 tulisan hotel
    addRectAreaLight(
        0xFEEA3C, 3, 0.55, 2.7, //wrn, intensity, w, h
        [6.360, 5.096, 11.072] //pos xyz
    );
    // 5 panah => light abu abu
    addRectAreaLight(
        0x757575, 10, 0.95, 2.4, //wrn, intensity, w, h
        [6.067, 1.747, 12.851], //pos xyz
        [0, 0, Math.PI / -6] //rotate xyz
    );
    // 6 (kotak kuning dibawah kotak biru)
    addRectAreaLight(
        0xFFFF00, 5, 1.1, 3.3, //wrn, intensity, w, h
        [-3.878, 3.102, 16.518] //pos xyz
    );
    // 7 panah abu 2 (atas)
    addRectAreaLight(
        0x757575, 10, 1.2, 2.4, //wrn, intensity, w, h
        [6.304, 10.881, 24.181], //pos xyz
        [0, 0, Math.PI / -6] //rotate xyz
    );
    // 8 kotak kuning sblm tulisan laundry 
    addRectAreaLight(
        0xFFFF00, 5, 1.1, 3.3, 
        [6.171, 3.157, 27.700]
    );
    // 9 senyum dekat kotak kuning tulisan laundry 
    addRectAreaLight(0xFFFF00, 
        5, 1.3, 1.3, 
        [7.104, 3.346, 24.238]
    );
    // 10 tulisan laundry 
    addRectAreaLight(0x85C3F6, 5, 7, 1.5, 
        [5.438, 6.122, 35.857], 
        [0, Math.PI / -2, 0]
    );
    // 11 panah peach dkt laundry
    addRectAreaLight(
        0xFDAA91, 10, 1.2, 2.4, 
        [-4.642, 6.936, 32.171], 
        [0, 0, Math.PI / -5]
    );
    // 12 panah putih dkt laundry
    addRectAreaLight(
        0xFFFFFF, 10, 1.2, 2.7, 
        [-1.482, 6.825, 39.800], 
        [0, 0, Math.PI / 5]
    );
    // 13 senyum 2 
    addRectAreaLight(
        0xFFFF00, 5, 0.8, 0.8, 
        [-4.965, 3.071, 36.416]
    );
    // 14 biru panjang 2 
    addRectAreaLight(0x0000FF, 5, 1, 5.5, 
        [-7.656, 4.079, 37.460]
    );
    // 15 kotak kuning 3 
    addRectAreaLight(
        0xFFFF00, 5, 1.1, 3.3, 
        [2.902, 2.315, 46.963]
    );
    // 16 panah putih lurus 
    addRectAreaLight(
        0xFFFFFF, 10, 1.2, 2.9, 
        [-2.957, 6.354, 47.556]
    );
    // 17 senyum last 
    addRectAreaLight(
        0xFFFF00, 10, 2, 2, 
        [-9.620, 4.732, 49.630]
    );
    // hotel kuning
    addRectAreaLight(
        0xFFFF00, 10, 2, 9.9, 
        [15.89, 8, 29.188], 
        [0, Math.PI / 2, 0]
    );
    addRectAreaLight(
        0xFFFF00, 10, 2, 9.9, 
        [14.89, 8, 29.188], 
        [0, -Math.PI / 2, 0]
    );
    // panah merah bsr
    addRectAreaLight(
        0xFF0000, 4, 6.5, 4, 
        [4.69, 9.8, 7.6], 
        [0, -Math.PI / 2, 0]
    );
    // hotel kuning dpn
    addRectAreaLight(
        0xFFFF00, 4, 1, 2.5, 
        [6.27, 5.2, 11.39]
    );
    // extra lighting laundry
    addRectAreaLight(
        0x00FFFF, 4, 5, 2.5, 
        [-0.09, 9.37, 35.447], 
        [0, -Math.PI / 3, 0]
    );

 //TAMBAHAN RECTANGLE BUAT ENVIRONMENT 
    //Rect light (buat neon) 
    addRectAreaLight(
        0xff0000, 5, 15, 9, 
        [-15, 5, 6], 
        [0, -Math.PI / 2, 0]
    ); // RED ambient 1
    addRectAreaLight(
        0x00FFFF, 5, 15, 5, 
        [0.52, 10, -5.989], 
        [-Math.PI / 5, 0, 0]
    ); // CYAN ambient 2
    addRectAreaLight(
        0x9E00FF, 10, 5, 9, 
        [23.476, 6.863, 26.66], 
        [-Math.PI / 2, Math.PI / 2, Math.PI / 2]
    ); // MAGENTA ambient 3
    addRectAreaLight(
        0x00FFFF, 5, 15, 5, 
        [3.727, 12.417, 34.857], 
        [-Math.PI / 6, 0, 0]
    ); // CYAN ambient 4
    addRectAreaLight(
        0x0000FF, 5, 15, 10, 
        [1.352, 16.417, 16.394], 
        [-Math.PI / 4, Math.PI / 2, 0]
    ); // BLUE ambient 5 
    addRectAreaLight(
        0xFF0000, 5, 15, 5, 
        [-1.119, 5.393, 45.695], 
        [0, Math.PI / 2, 0]
    ); // RED ambient 6.1
    addRectAreaLight(
        0xFF0000, 5, 15, 15, 
        [-0.93, 15.393, 43.596], 
        [-Math.PI / 2, 0, 0]
    ); // RED ambient 6.2
    addRectAreaLight(
        0x9E00FF, 5, 15, 10, 
        [-4.73, 10.31, 60.695], 
        [0, Math.PI / 2, 0]
    ); // MAGENTA ambient 7.1
    addRectAreaLight(
        0xFFFF00, 2, 20, 10, 
        [-4.73, 10.31, 60.695], 
        [0, -Math.PI / 2, 0]
    ); // YELLOW ambient 7.2
    addRectAreaLight(
        0x00FF00, 5, 15, 15, 
        [18.026, 17.113, 52], 
        [-Math.PI / 2, 0, 0]
    ); // GREEN ambient pojokan 8
    addRectAreaLight(
        0xFFFF00, 3, 15, 15, 
        [-12.733, 14.99, 8.7], 
        [-Math.PI / 2, 0, 0]
    ); // YELLOW ambient pojokan 9
    addRectAreaLight(
        0x0000FF, 10, 15, 15, 
        [-10.374, 19.5, -16.215], 
        [-Math.PI / 2, 0, 0]
    ); // BLUE ambient pojokan 10
    addRectAreaLight(
        0xFF0000, 5, 15, 15, 
        [-25.084, 19.5, 63.485], 
        [-Math.PI / 2, 0, 0]
    ); // RED ambient pojokan 11
    addRectAreaLight(
        0x00FFFF, 2, 20, 15, 
        [-0.057, 9.872, 73.963], 
        [-Math.PI / 3, 0, 0]
    ); // CYAN ambient pojokan 12
    addRectAreaLight(
        0xFF0000, 5, 15, 5, 
        [2.242, 19.22, -16.989], 
        [-Math.PI / 5, 0, 0]
    ); // RED ambient 13
    addRectAreaLight(
        0x00FF00, 5, 5, 5, 
        [-4.336, 6.937, 11.413], 
        [-Math.PI / 4, 0, 0]
    ); // GREEN ambient 14
    addRectAreaLight(
        0x00FF00, 5, 5, 5, 
        [7.978, 3.278, 27.915], 
        [Math.PI, 0, 0]
    ); // GREEN ambient facing backward 15
    addRectAreaLight(
        0x00FF00, 5, 5, 5, 
        [0.613, 8.257, 25.371], 
        [0, -Math.PI / 3, 0]
    ); // CYAN ambient 16

//=====================================================================
// DIRECTIONAL LIGHT
var light = new THREE.DirectionalLight(0xffff00, 0.5);
light.position.set(0.98, 5, -12);
light.target.position.set(-0.98, 5-5, 53);
light.rotation.set(45,0,0);
light.castShadow = true;

// light.shadow.bias = -0.0001;
light.shadow.mapSize.width = 1280*2;
light.shadow.mapSize.height = 1280*2;
light.shadow.camera.near = 0.1+10;
light.shadow.camera.far = 90;
// light.shadow.camera.left = 100;
// light.shadow.camera.right = -100;
// light.shadow.camera.top = 100;
// light.shadow.camera.bottom = -100;

scene.add(light);
scene.add(light.target);

// const lightHelper = new THREE.DirectionalLightHelper(light, 1); // ukuran helper
//     scene.add(lightHelper);

// Add a CameraHelper to visualize the shadow camera's frustum
// const shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(shadowCameraHelper);

// HEMISPHERE LIGHT => biar kyk matahari bs mantulno cahaya kann trs kita bs liat langitnya biru
light = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.3);
    light.castShadow = true;
    scene.add(light);

// POINT LIGHT
    light = new THREE.PointLight(0xffff00, 50);
    light.position.set(0.5, 4, 0);
    light.castShadow = true;
    scene.add(light);

    light.shadow.mapSize.width = 512/2; // default
    light.shadow.mapSize.height = 512/2; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 10; // default

// const lightHelper = new THREE.PointLightHelper(light, 1); // ukuran helper
// scene.add(lightHelper);
// // Add a CameraHelper to visualize the shadow camera's frustum
// const shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(shadowCameraHelper);

// POINT LIGHT
light = new THREE.PointLight(0xffff00, 50);
light.position.set(0, 4, 13);
light.castShadow = true;
scene.add(light);

light.shadow.mapSize.width = 512/2; // default
light.shadow.mapSize.height = 512/2; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 10; // default

// POINT LIGHT
light = new THREE.PointLight(0x00ff00, 30);
light.position.set(3, 4, 21);
light.castShadow = true;
scene.add(light);

light.shadow.mapSize.width = 512/2; // default
light.shadow.mapSize.height = 512/2; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 10; // default

// POINT LIGHT di pinggir merah
light = new THREE.PointLight(0xff0000, 40);
light.position.set(-1, 4, 42);
light.castShadow = true;
scene.add(light);

light.shadow.mapSize.width = 512/2; // default
light.shadow.mapSize.height = 512/2; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 10; // default

// POINT LIGHT di akhir 
light = new THREE.PointLight(0x00ffff, 50);
light.position.set(-1, 4, 64.6);
light.castShadow = true;
scene.add(light);

light.shadow.mapSize.width = 512/2; // default
light.shadow.mapSize.height = 512/2; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 10; // default

// // SPOT LIGHT
//     light = new THREE.SpotLight(0xff0000, 50);
//     light.position.set(10, 10, 0);
//     light.castShadow = true;
//     scene.add(light);

// AMBIENT LIGHT
    light = new THREE.AmbientLight(0xffffff, 0.02); // soft white light
    light.castShadow = true;
    scene.add(light);
}
