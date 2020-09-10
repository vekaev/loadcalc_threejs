import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { responceData } from '../responceData';
import createSceneObjects from '../utils';
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three/build/three.module.js';
const OrbitControls = require('three-orbit-controls')(THREE);

const initialPosition = {
  x: 20,
  y: 15,
  z: 25,
};

const WebGl = forwardRef(({ data, viewPallet, height, width }, ref) => {
  let firstRender = false;

  const canvas = useRef(null);

  const renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.5, 1000);

  camera.updateProjectionMatrix();

  const controls = new OrbitControls(camera, renderer.domElement);

  useImperativeHandle(ref, () => ({
    inheritCamera() {
      let tweenDuration = 1000;

      TWEEN.removeAll();

      let targetNewPos = { x: initialPosition.x, y: initialPosition.y, z: 0 };

      let camTween = new TWEEN.Tween(camera.position)
        .to(initialPosition, tweenDuration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
      let targetTween = new TWEEN.Tween(controls.target)
        .to(targetNewPos, tweenDuration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    },
  }));

  let scene = new THREE.Scene();

  renderer.setClearColor(0xffffff);

  renderer.setSize(width, height);

  camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);

  controls.maxDistance = 100;
  controls.minDistance = 20;

  const light = new THREE.AmbientLight(0xffffff, 5.0);

  const gridHelper = new THREE.GridHelper(400, 20, 0xb6bdc4, 0xb6bdc4);

  data.forEach((item) => {
    createSceneObjects(scene, item, viewPallet);
  });

  useEffect(() => {
    canvas.current.innerHTML = null;
    canvas.current.appendChild(renderer.domElement);

    const animate = () => {
      if (width && height) {
        renderer.setSize(width, height);
        TWEEN.update();
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
    };
    animate();
    firstRender = true;
  });

  scene.add(light, gridHelper);
  console.log(width);
  return (
    <>
      <div className='canvas' ref={canvas}></div>
    </>
  );
});

export default React.memo(WebGl);
