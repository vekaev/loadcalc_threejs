import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import createSceneObjects from '../utils';
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three/build/three.module.js';

const OrbitControls = require('three-orbit-controls')(THREE);

const sizeCoefficient = 50;

const WebGl = forwardRef(({ responceData, viewPallet, height, width }, ref) => {
  const containerSize = {
    x: responceData?.size.x / sizeCoefficient || 10,
    y: responceData?.size.y / sizeCoefficient || 10,
    z: responceData?.size.z / sizeCoefficient - 1 || 10,
  };
  console.log(containerSize);
  const cameraPosition = {
    x: 5,
    y: 5,
    z: 6,
  };

  let initialPosition = {
    x: containerSize.x / 2,
    y: containerSize.y / 2,
    z: containerSize.z / 2,
  };

  const canvas = useRef(null);
  const renderer = new THREE.WebGLRenderer();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.5, 1000);
  camera.target = initialPosition;
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  const controls = new OrbitControls(camera, renderer.domElement);
  let scene = new THREE.Scene();
  const light = new THREE.AmbientLight(0xffffff, 5.0);
  const gridHelper = new THREE.GridHelper(400, 80, 0xb6bdc4, 0xb6bdc4);

  let maxSizeParam = function () {
    let maxParam = 0;
    for (let param in containerSize) {
      if (containerSize[param] > maxParam) {
        maxParam = containerSize[param];
      }
    }
    return maxParam;
  };

  let pallet = responceData.children;

  pallet.forEach((item) => {
    createSceneObjects(scene, item, viewPallet, sizeCoefficient);
  });

  useEffect(() => {
    scene.add(light, gridHelper);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xffffff);
    renderer.setSize(width, height);

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    controls.minDistance = maxSizeParam() + 5;
    controls.maxDistance = 100;

    controls.target.set(
      initialPosition.x,
      initialPosition.y,
      initialPosition.z,
    );

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
  });

  useImperativeHandle(ref, () => ({
    inheritCamera() {
      let tweenDuration = 1000;
      TWEEN.removeAll();
      let camTween = new TWEEN.Tween(camera.position)
        .to(cameraPosition, tweenDuration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
      let targetTween = new TWEEN.Tween(controls.target)
        .to(initialPosition, tweenDuration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    },
    zoom(par) {
      const { x, y, z } = camera.position;
      let tweenDuration = 500;
      TWEEN.removeAll();
      let camTween = new TWEEN.Tween(camera.position)
        .to({ x, y, z: z + 10 }, tweenDuration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    },
  }));

  return (
    <>
      <div className='canvas' ref={canvas}></div>
    </>
  );
});

export default React.memo(WebGl);
