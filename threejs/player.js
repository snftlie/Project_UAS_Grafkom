import * as THREE from "three";
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

export class Player {
    constructor(camera, controller, scene, speed, boundBox) {
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;
        this.speed = speed;
        this.state = "idle";
        this.rotationVector = new THREE.Vector3(0, 0, 0);
        this.animations = {};
        this.box = new THREE.Box3(); //box playernya
        this.boundBoxes = boundBox; // boundBox dri main.js
        this.camera.setup(new THREE.Vector3(0, 0, 0), this.rotationVector);
        this.loadModel();
    }

    loadModel() {
        var loader = new FBXLoader();
        loader.setPath('./resources/');
        loader.load('Breathing Idle.fbx', (fbx) => {
            fbx.scale.setScalar(0.01);
            fbx.traverse(c => {
                c.castShadow = true;
                c.receiveShadow = true;
            });
            this.mesh = fbx;
            this.box.setFromObject(this.mesh);
            this.scene.add(this.mesh);
            this.mesh.rotation.y += Math.PI / 2;
            this.mixer = new THREE.AnimationMixer(this.mesh);

            var onLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this.mixer.clipAction(clip);

                this.animations[animName] = {
                    clip: clip,
                    action: action,
                };
            };

            const loader = new FBXLoader();
            loader.setPath('./resources/');
            loader.load('Breathing Idle.fbx', (fbx) => { onLoad('idle', fbx) });
            loader.load('Walking.fbx', (fbx) => { onLoad('run', fbx) });
        });
    }

    update(dt) {
        if (this.mesh && this.animations) {
            const speed = 3.0;
            var direction = new THREE.Vector3(0, 0, 0);
    
            if (this.controller.keys['forward']) {
                direction.x = speed;
                this.mesh.rotation.y = Math.PI / 2;
            }
            if (this.controller.keys['backward']) {
                direction.x = -1 * speed;
                this.mesh.rotation.y = -Math.PI / 2;
            }
            if (this.controller.keys['left']) {
                direction.z = -1 * speed;
                this.mesh.rotation.y = Math.PI;
            }
            if (this.controller.keys['right']) {
                direction.z = speed;
                this.mesh.rotation.y = 0;
            }
    
            if (direction.length() == 0) {
                if (this.animations['idle']) {
                    if (this.state != "idle") {
                        this.mixer.stopAllAction();
                        this.state = "idle";
                    }
                    this.mixer.clipAction(this.animations['idle'].clip).play();
                }
            } else {
                if (this.animations['run']) {
                    if (this.state != "run") {
                        this.mixer.stopAllAction();
                        this.state = "run";
                    }
                    this.mixer.clipAction(this.animations['run'].clip).play();
                }
            }
    
            if (this.controller.mouseDown) {
                var dtMouse = this.controller.deltaMousePos;
                dtMouse.x = dtMouse.x / Math.PI;
                dtMouse.y = dtMouse.y / Math.PI;
    
                this.rotationVector.y += dtMouse.x * dt * 10;
                this.rotationVector.z += dtMouse.y * dt * 10;
                this.mesh.rotation.y += dtMouse.x * dt * 10;
            }
    
            var forwardVector = new THREE.Vector3(1, 0, 0);
            var rightVector = new THREE.Vector3(0, 0, 1);
            forwardVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationVector.y);
            rightVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationVector.y);
    
            // Simpan posisi sebelumnya jika terjadi collision
            const previousPosition = this.mesh.position.clone();
    
            this.mesh.position.add(forwardVector.multiplyScalar(dt * this.speed * direction.x));
            this.mesh.position.add(rightVector.multiplyScalar(dt * this.speed * direction.z));
    
            this.camera.setup(this.mesh.position, this.rotationVector, this.boundBoxes); // tambahkan parameter boundBoxes
            // this.camera.setup(this.mesh.position, this.rotationVector); //third person setup

            this.box.setFromObject(this.mesh);

            // Cek collision
            if (this.boundBoxes) {
                for (let i = 0; i < this.boundBoxes.length; i++) {
                    if (this.box.intersectsBox(this.boundBoxes[i])) {
                        // Kembali ke posisi sebelumnya jika terjadi collision
                        this.mesh.position.copy(previousPosition);
                        this.box.setFromObject(this.mesh);
                        break; // berhenti mengecek box lain
                    }
                }
            }
            if (this.mixer) {
                this.mixer.update(dt);
            }
        }
    }
    
}

export class PlayerController {
    constructor() {
        this.keys = {
            "forward": false,
            "backward": false,
            "left": false,
            "right": false
        }
        this.mousePos = new THREE.Vector2();
        this.mouseDown = false;
        this.deltaMousePos = new THREE.Vector2();
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        document.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
        document.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
    }
    onMouseDown(event) {
        this.mouseDown = true;
    }
    onMouseUp(event) {
        this.mouseDown = false;
    }
    onMouseMove(event) {
        var currentMousePos = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        this.deltaMousePos.addVectors(currentMousePos, this.mousePos.multiplyScalar(-1));
        this.mousePos.copy(currentMousePos);
    }
    onKeyDown(event) {
        switch (event.keyCode) {
            case "W".charCodeAt(0):
            case "w".charCodeAt(0):
                this.keys['forward'] = true;
                break;
            case "S".charCodeAt(0):
            case "s".charCodeAt(0):
                this.keys['backward'] = true;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['left'] = true;
                break;
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['right'] = true;
                break;
        }
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case "W".charCodeAt(0):
            case "w".charCodeAt(0):
                this.keys['forward'] = false;
                break;
            case "S".charCodeAt(0):
            case "s".charCodeAt(0):
                this.keys['backward'] = false;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['left'] = false;
                break;
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['right'] = false;
                break;
        }
    }
}

export class ThirdPersonCamera {
    constructor(camera, positionOffSet, targetOffSet) {
        this.camera = camera;
        this.positionOffSet = positionOffSet;
        this.targetOffSet = targetOffSet;
    }
    // setup(target, angle) {
    //     var temp = new THREE.Vector3(0, 0, 0);
    //     temp.copy(this.positionOffSet);
    //     temp.applyAxisAngle(new THREE.Vector3(angle.x, 1, 0), angle.y);
    //     temp.applyAxisAngle(new THREE.Vector3(angle.y, 0, 1), angle.z);
    //     temp.addVectors(target, temp);
    //     this.camera.position.copy(temp);
    //     temp = new THREE.Vector3(0, 0, 0);
    //     temp.addVectors(target, this.targetOffSet);
    //     this.camera.lookAt(temp);
    // }
    setup(target, angle, boundBoxes) {
        var temp = new THREE.Vector3(0, 0, 0);
        temp.copy(this.positionOffSet);
        temp.applyAxisAngle(new THREE.Vector3(angle.x, 1, 0), angle.y);
        temp.applyAxisAngle(new THREE.Vector3(angle.y, 0, 1), angle.z);
        temp.addVectors(target, temp);

        const cameraBox = new THREE.Box3().setFromCenterAndSize(temp, new THREE.Vector3(8, 8, 8)); // Misalkan ukuran kotak adalah 8x8x8

        let closestDistance = Infinity;
        let adjustedPosition = temp.clone();

        if (boundBoxes) {
            for (let i = 0; i < boundBoxes.length; i++) {
                const intersection = cameraBox.intersectsBox(boundBoxes[i]);
                if (intersection) {
                    // Calculate closest non-colliding position
                    const box = boundBoxes[i];
                    const closestPoint = new THREE.Vector3(
                        Math.max(box.min.x, Math.min(temp.x, box.max.x)),
                        Math.max(box.min.y, Math.min(temp.y, box.max.y)),
                        Math.max(box.min.z, Math.min(temp.z, box.max.z))
                    );
                    const distance = temp.distanceToSquared(closestPoint);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        adjustedPosition = closestPoint;
                    }
                }
            }
        }

        this.camera.position.copy(adjustedPosition);

        temp = new THREE.Vector3(0, 0, 0);
        temp.addVectors(target, this.targetOffSet);
        this.camera.lookAt(temp);
    }
}
