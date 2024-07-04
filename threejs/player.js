import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Adding setFocalLength method to PerspectiveCamera prototype
THREE.PerspectiveCamera.prototype.setFocalLength = function (focalLength) {
  const vExtentSlope = (0.5 * this.getFilmHeight()) / focalLength;
  this.fov = THREE.MathUtils.RAD2DEG * 2 * Math.atan(vExtentSlope);
  this.updateProjectionMatrix();
};

export class Player {
  constructor(camera, scene, speed, positionObject) {
    this.camera = camera;
    this.controller = new PlayerController(camera, positionObject);
    this.scene = scene;
    this.speed = speed;
    this.state = "idle";
    this.rotationVector = new THREE.Vector3(0, 0, 0);
    this.animations = {};

    this.lastRotation = 0;
    this.positionObject = positionObject;

    this.camera.setup(positionObject);
    // this.camera.setup2();

    // this.mesh = new THREE.Mesh(
    //     new THREE.BoxGeometry(1,1,1),
    //     new THREE.MeshPhongMaterial({color: 0xFF1111})
    // );
    // this.scene.add(this.mesh);
    // this.mesh.castShadow = true;
    // this.mesh.receiveShadow = true;

    this.loadModel();
  }

  loadModel() {
    var loader = new FBXLoader();
    loader.setPath("./resources/");
    loader.load("Breathing Idle.fbx", (fbx) => {
      fbx.scale.setScalar(0.01);
      fbx.traverse((c) => {
        c.castShadow = true;
        c.receiveShadow = true;
      });
      this.mesh = fbx;
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
      console.log(this.animations);

      const loader = new FBXLoader();
      loader.setPath("./resources/");
      loader.load("Breathing Idle.fbx", (fbx) => {
        onLoad("idle", fbx);
      });
      loader.load("Walking.fbx", (fbx) => {
        onLoad("run", fbx);
      });
    });
  }

  update(dt) {
    if (this.mesh && this.animations) {
      this.lastRotation = this.mesh.rotation.y;

      var forwardVector = new THREE.Vector3();
      this.camera.camera.getWorldDirection(forwardVector);

      forwardVector.normalize();
      forwardVector = new THREE.Vector3(forwardVector.x, 0, forwardVector.z);

      var direction = new THREE.Vector3(0, 0, 0);

      if (this.controller.keys["forward"]) {
        direction.add(forwardVector);
        this.mesh.position.add(forwardVector.multiplyScalar(dt * this.speed));
        const angle = Math.atan2(forwardVector.x, forwardVector.z);
        this.mesh.rotation.y = angle;
        console.log("Moving forward", angle);
      }
      if (this.controller.keys["backward"]) {
        direction.add(forwardVector.clone().multiplyScalar(-1));
        this.mesh.position.add(forwardVector.multiplyScalar(dt * -this.speed));
        const angle = Math.atan2(forwardVector.x, forwardVector.z);
        this.mesh.rotation.y = angle;
        console.log("Moving backward");
      }
      if (this.controller.keys["left"]) {
        // Calculate left vector by rotating the forward vector 90 degrees around the up axis
        const leftVector = new THREE.Vector3(
          forwardVector.z,
          0,
          -forwardVector.x
        ).normalize();
        direction.add(leftVector);
        this.mesh.position.add(leftVector.multiplyScalar(dt * this.speed));
        const angle = Math.atan2(forwardVector.x, forwardVector.z);
        this.mesh.rotation.y = angle + Math.PI / 2;
        console.log("Moving left");
      }
      if (this.controller.keys["right"]) {
        // Calculate right vector by rotating the forward vector -90 degrees around the up axis
        const rightVector = new THREE.Vector3(
          -forwardVector.z,
          0,
          forwardVector.x
        ).normalize();
        direction.add(rightVector);
        this.mesh.position.add(rightVector.multiplyScalar(dt * this.speed));
        const angle = Math.atan2(forwardVector.x, forwardVector.z);
        this.mesh.rotation.y = angle - Math.PI / 2;
        console.log("Moving right");
      }

      // FIRST PERSON
      // if (this.controller.keys["rotatexLeft"]) {
      //   this.camera.camera.rotation.y += 0.1;
      // }
      // if (this.controller.keys["rotatexRight"]) {
      //   this.camera.camera.rotation.y -= 0.1;
      // }
      this.lastRotation = this.mesh.rotation.y;
      console.log(direction.length);
      if (direction.length() == 0) {
        if (this.animations["idle"]) {
          if (this.state != "idle") {
            this.mixer.stopAllAction();
            this.state = "idle";
          }
          this.mixer.clipAction(this.animations["idle"].clip).play();
        }
      } else {
        if (this.animations["run"]) {
          if (this.state != "run") {
            this.mixer.stopAllAction();
            this.state = "run";
            this.mixer.clipAction(this.animations["run"].clip).play();
            console.log("RUN animation playing");
          }
        }
      }

      if (this.controller.mouseDown) {
        var dtMouse = this.controller.deltaMousePos;
        dtMouse.x = dtMouse.x / Math.PI;
        dtMouse.y = dtMouse.y / Math.PI;

        // this.rotationVector.y += dtMouse.x * dt * 10;
        // this.rotationVector.z += dtMouse.y * dt * 10;
        // this.mesh.rotation.y += dtMouse.x * dt * 10;

        this.rotationVector.y += dtMouse.x * dt * 0; // untuk dia tidak rotate pas diem
        this.rotationVector.z += dtMouse.y * dt * 0;
      }
      this.mesh.rotation.y += this.rotationVector.y;

      var forwardVector = new THREE.Vector3(1, 0, 0);
      var rightVector = new THREE.Vector3(0, 0, 1);
      // forwardVector.applyAxisAngle(
      //   new THREE.Vector3(0, 1, 0),
      //   this.rotationVector.y
      // );
      // rightVector.applyAxisAngle(
      //   new THREE.Vector3(0, 1, 0),
      //   this.rotationVector.y
      // );

      this.mesh.position.add(
        forwardVector.multiplyScalar(dt * this.speed * direction.x)
      );
      this.mesh.position.add(
        rightVector.multiplyScalar(dt * this.speed * direction.z)
      );

      this.camera.setup(this.positionObject);
      this.positionObject = this.mesh.position;

      if (this.mixer) {
        this.mixer.update(dt);
      }
    }
  }
}

export class PlayerController {
  constructor(ThirdPersonCamera, positionObject) {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,

      // FIRST PERSON
      // rotatexLeft: false,
      // rotatexRight: false,
    };
    this.mousePos = new THREE.Vector2();
    this.mouseDown = false;
    this.deltaMousePos = new THREE.Vector2();
    this.ThirdPersonCamera = ThirdPersonCamera; // Store camera reference

    document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
    document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
    document.addEventListener("mousemove", (e) => this.onMouseMove(e), false);
    document.addEventListener("mousedown", (e) => this.onMouseDown(e), false);
    document.addEventListener("mouseup", (e) => this.onMouseUp(e), false);
    document.addEventListener("wheel", (e) => this.onMouseWheel(e), false); // Add this line
  }
  onMouseDown(event) {
    this.mouseDown = true;
  }
  onMouseUp(event) {
    this.mouseDown = false;
  }
  onMouseMove(event) {
    if (!this.mouseDown) return;

    this.center = this.ThirdPersonCamera.positionObject;

    // var currentMousePos = new THREE.Vector2(
    //   (event.clientX / window.innerWidth) * 2 - 1,
    //   -(event.clientY / window.innerHeight) * 2 + 1
    // );
    // this.deltaMousePos.addVectors(
    //   currentMousePos,
    //   this.mousePos.multiplyScalar(-1)
    // );
    // this.mousePos.copy(currentMousePos);

    const deltaX =
      (event.movementX || event.mozMovementX || event.webkitMovementX || 0) *
      0.01; // Convert mouse position to angle
    const deltaY =
      (event.movementY || event.mozMovementY || event.webkitMovementY || 0) *
      0.01; // Vertical rotation

    this.ThirdPersonCamera.theta += deltaX; // Update theta based on horizontal movement
    this.ThirdPersonCamera.phi += deltaY; // Update phi based on vertical movement
    // Ensure phi stays within the range of [-π/2, π/2] to avoid flipping the camera
    this.ThirdPersonCamera.phi = Math.max(
      -Math.PI / 2 + 0.01,
      Math.min(Math.PI / 2 - 0.01, this.ThirdPersonCamera.phi)
    );

    this.ThirdPersonCamera.updateCameraPosition();

    // kalo first person ini di comment
    this.ThirdPersonCamera.camera.lookAt(this.center);
  }

  onMouseWheel(event) {
    const camera = this.ThirdPersonCamera.camera;
    const currentFocalLength = camera.getFocalLength();
    const focalLengthChange = event.deltaY < 0 ? -2 : 2;
    const newFocalLength = currentFocalLength + focalLengthChange;

    // Update the camera's focal length
    camera.setFocalLength(newFocalLength);

    // Optional: Add clamping to restrict the focal length
    const minFocalLength = 10; // Set your minimum focal length
    const maxFocalLength = 200; // Set your maximum focal length
    // camera.setFocalLength(Math.max(minFocalLength, Math.min(newFocalLength, maxFocalLength)));

    // Menyekat nilai focal length dalam rentang yang diizinkan
    const clampedFocalLength = THREE.MathUtils.clamp(
      newFocalLength,
      minFocalLength,
      maxFocalLength
    );

    // Setel focal length baru
    camera.setFocalLength(clampedFocalLength);
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case "W".charCodeAt(0):
      case "w".charCodeAt(0):
        this.keys["forward"] = true;
        break;
      case "S".charCodeAt(0):
      case "s".charCodeAt(0):
        this.keys["backward"] = true;
        break;
      case "A".charCodeAt(0):
      case "a".charCodeAt(0):
        this.keys["left"] = true;
        break;
      case "D".charCodeAt(0):
      case "d".charCodeAt(0):
        this.keys["right"] = true;
        break;

      // first person
      case "Q".charCodeAt(0):
      case "q".charCodeAt(0):
        this.keys["rotatexLeft"] = true;
        break;
      case "E".charCodeAt(0):
      case "e".charCodeAt(0):
        this.keys["rotatexRight"] = true;
        break;
    }
  }
  onKeyUp(event) {
    switch (event.keyCode) {
      case "W".charCodeAt(0):
      case "w".charCodeAt(0):
        this.keys["forward"] = false;
        break;
      case "S".charCodeAt(0):
      case "s".charCodeAt(0):
        this.keys["backward"] = false;
        break;
      case "A".charCodeAt(0):
      case "a".charCodeAt(0):
        this.keys["left"] = false;
        break;
      case "D".charCodeAt(0):
      case "d".charCodeAt(0):
        this.keys["right"] = false;
        break;

      // first person
      case "Q".charCodeAt(0):
      case "q".charCodeAt(0):
        this.keys["rotatexLeft"] = false;
        break;
      case "E".charCodeAt(0):
      case "e".charCodeAt(0):
        this.keys["rotatexRight"] = false;
        break;
    }
  }
}

// export class ThirdPersonCamera {
//   constructor(camera, positionOffSet, targetOffSet) {
//     this.camera = camera;
//     this.positionOffSet = positionOffSet;
//     this.targetOffSet = targetOffSet;
//   }
//   setup(target, angle) {
//     var temp = new THREE.Vector3(0, 0, 0);
//     temp.copy(this.positionOffSet);
//     temp.applyAxisAngle(new THREE.Vector3(angle.x, 1, 0), angle.y);
//     temp.applyAxisAngle(new THREE.Vector3(angle.y, 0, 1), angle.z);
//     temp.addVectors(target, temp);
//     this.camera.position.copy(temp);
//     temp = new THREE.Vector3(0, 0, 0);
//     temp.addVectors(target, this.targetOffSet);
//     this.camera.lookAt(temp);
//   }
// }

export class ThirdPersonCamera {
  constructor(camera, positionOffSet, targetOffSet) {
    this.camera = camera;
    this.positionOffSet = positionOffSet;
    this.targetOffSet = targetOffSet;
    this.zoomLevel = 1; // Default zoom level

    this.camera.rotation.order = "YXZ"; // Set rotation order if needed
    this.doOnce = false;
    this.radius = 10; // Radius from center to camera position
    this.positionObject = 0;

    this.theta = 0;
    this.phi = 0;
  }

  updateCameraPosition() {
    const x = this.positionObject.x + this.radius * Math.sin(this.theta);
    const y = this.positionObject.y + this.radius * Math.sin(this.phi);
    const z = this.positionObject.z + this.radius * Math.cos(this.theta);
    this.camera.position.set(x, y, z);
  }
  setup(positionObject) {
    if (!this.doOnce) {
      this.doOnce = true;
      this.camera.lookAt(positionObject);
    }
    this.positionObject = positionObject;
    this.updateCameraPosition(this.theta, this.phi);
  }

  // setup2(target, angle, boundBoxes) {
  //   var temp = new THREE.Vector3(0, 0, 0);
  //   temp.copy(this.positionOffSet);
  //   temp.applyAxisAngle(new THREE.Vector3(angle.x, 1, 0), angle.y);
  //   temp.applyAxisAngle(new THREE.Vector3(angle.y, 0, 1), angle.z);
  //   temp.addVectors(target, temp);

  //   const cameraBox = new THREE.Box3().setFromCenterAndSize(
  //     temp,
  //     new THREE.Vector3(8, 8, 8)
  //   ); // Misalkan ukuran kotak adalah 8x8x8

  //   let closestDistance = Infinity;
  //   let adjustedPosition = temp.clone();

  //   if (boundBoxes) {
  //     for (let i = 0; i < boundBoxes.length; i++) {
  //       const intersection = cameraBox.intersectsBox(boundBoxes[i]);
  //       if (intersection) {
  //         // Calculate closest non-colliding position
  //         const box = boundBoxes[i];
  //         const closestPoint = new THREE.Vector3(
  //           Math.max(box.min.x, Math.min(temp.x, box.max.x)),
  //           Math.max(box.min.y, Math.min(temp.y, box.max.y)),
  //           Math.max(box.min.z, Math.min(temp.z, box.max.z))
  //         );
  //         const distance = temp.distanceToSquared(closestPoint);

  //         if (distance < closestDistance) {
  //           closestDistance = distance;
  //           adjustedPosition = closestPoint;
  //         }
  //       }
  //     }
  //   }

  //   this.camera.position.copy(adjustedPosition);

  //   temp = new THREE.Vector3(0, 0, 0);
  //   temp.addVectors(target, this.targetOffSet);
  //   this.camera.lookAt(temp);
  // }

  zoom(deltaZoom) {
    this.zoomLevel += deltaZoom * 0.1;
    this.zoomLevel = Math.max(0.5, Math.min(this.zoomLevel, 2)); // Clamp zoom level between 0.5 and 2
  }
}
export class FirstPersonCamera {
  constructor(camera, positionOffSet, targetOffSet) {
    this.camera = camera;
    this.positionOffSet = positionOffSet;
    this.targetOffSet = targetOffSet;
    this.zoomLevel = 1; // Default zoom level

    this.camera.rotation.order = "YXZ"; // Set rotation order if needed
    this.doOnce = false;
    this.radius = 1; // Radius from center to camera position
    this.positionObject = 0;

    this.theta = 0;
    this.phi = 0;
  }

  updateCameraPosition() {
    const x = this.positionObject.x - 1 + this.zoomLevel;
    const y = this.positionObject.y + 1 + this.zoomLevel;
    const z = this.positionObject.z - 1 + this.zoomLevel;
    this.camera.position.set(x, y, z);
  }

  setup(positionObject) {
    if (!this.doOnce) {
      this.doOnce = true;
      // this.camera.lookAt(positionObject);
    }
    this.positionObject = positionObject;
    this.updateCameraPosition();
  }

  // setup2(target, angle, boundBoxes) {
  //   var temp = new THREE.Vector3(0, 0, 0);
  //   temp.copy(this.positionOffSet);
  //   temp.applyAxisAngle(new THREE.Vector3(angle.x, 1, 0), angle.y);
  //   temp.applyAxisAngle(new THREE.Vector3(angle.y, 0, 1), angle.z);
  //   temp.addVectors(target, temp);

  //   const cameraBox = new THREE.Box3().setFromCenterAndSize(
  //     temp,
  //     new THREE.Vector3(8, 8, 8)
  //   ); // Misalkan ukuran kotak adalah 8x8x8

  //   let closestDistance = Infinity;
  //   let adjustedPosition = temp.clone();

  //   if (boundBoxes) {
  //     for (let i = 0; i < boundBoxes.length; i++) {
  //       const intersection = cameraBox.intersectsBox(boundBoxes[i]);
  //       if (intersection) {
  //         // Calculate closest non-colliding position
  //         const box = boundBoxes[i];
  //         const closestPoint = new THREE.Vector3(
  //           Math.max(box.min.x, Math.min(temp.x, box.max.x)),
  //           Math.max(box.min.y, Math.min(temp.y, box.max.y)),
  //           Math.max(box.min.z, Math.min(temp.z, box.max.z))
  //         );
  //         const distance = temp.distanceToSquared(closestPoint);

  //         if (distance < closestDistance) {
  //           closestDistance = distance;
  //           adjustedPosition = closestPoint;
  //         }
  //       }
  //     }
  //   }

  //   this.camera.position.copy(adjustedPosition);

  //   temp = new THREE.Vector3(0, 0, 0);
  //   temp.addVectors(target, this.targetOffSet);
  //   this.camera.lookAt(temp);
  // }

  zoom(deltaZoom) {
    this.zoomLevel += deltaZoom * 0.01;
    this.zoomLevel = Math.max(0.1, Math.min(this.zoomLevel, 2)); // Clamp zoom level between 0.5 and 2
  }

  rotate(roll, pitch, yaw) {
    // Apply rotation based on input
    this.camera.rotation.x += pitch;
    this.camera.rotation.y += yaw;
    this.camera.rotation.z += roll;

    // Ensure pitch stays within the range of [-π/3, π/3] (around -60 to 60 degrees)
    const maxPitch = Math.PI / 3; // 60 degrees in radians
    this.camera.rotation.x = Math.max(
      -maxPitch + 0.01,
      Math.min(maxPitch - 0.01, this.camera.rotation.x)
    );

    const maxYaw = Math.PI / 3; // 60 degrees in radians
    if (Math.abs(this.camera.rotation.y) > maxYaw) {
      this.camera.rotation.y = Math.sign(this.camera.rotation.y) * maxYaw;
    }

    // Ensure roll stays within the range of [-π/3, π/3] (around -60 to 60 degrees)
    const maxRoll = Math.PI / 3; // 60 degrees in radians
    this.camera.rotation.z = Math.max(
      -maxRoll + 0.01,
      Math.min(maxRoll - 0.01, this.camera.rotation.z)
    );
  }
}
