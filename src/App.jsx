import React, { useEffect, useRef, useState } from 'react';
import './main.scss';
import * as THREE from 'three/build/three.module.js';
import TWEEN from '@tweenjs/tween.js';
import { responceData } from './responceData';
import createSceneObjects from './utils';

const OrbitControls = require('three-orbit-controls')(THREE);

const defaultParam = {
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight,
};

const { WIDTH, HEIGHT } = defaultParam;

const App = () => {
  const [viewMode, setViewMode] = useState({
    showPallet: false,
  });
  const canvas = useRef(null);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.5, 1000);
  const controls = new OrbitControls(camera);

  const initialPosition = {
    x: 20,
    y: 15,
    z: 25,
  };

  function inheritCamera() {
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
  }
  function cameraZoomIn() {
    camera.position.z = camera.position.z - 10;
    // let cameraDis = camera.position.z;
    // console.log(cameraDis);
    // let zoomIn = new TWEEN.Tween(camera.position)
    //   .to(
    //     {
    //       x: camera.position.x,
    //       y: camera.position.y,
    //       z: cameraDis > 0 ? cameraDis - 5 : cameraDis + 5,
    //     },
    //     500,
    //   )
    //   .start();
    // console.log(cameraDis);
  }
  function cameraZoomOut() {
    console.log(camera.position);
    camera.position.z = camera.position.z + 10;
    console.log(camera.position);
    // let cameraDis = camera.position.z;
    // console.log(cameraDis, camera.position);
    // let zoomIn = new TWEEN.Tween(camera.position)
    //   .to(
    //     {
    //       x: camera.position.x,
    //       y: camera.position.y,
    //       z: cameraDis > 0 ? cameraDis + 5 : cameraDis - 5,
    //     },
    //     500,
    //   )
    //   .start();
    // console.log(cameraDis, camera.position);
  }

  const changeObjectsView = (command) => {
    //clear cash

    inheritCamera();
    setTimeout(() => {
      setViewMode({
        ...viewMode,
        showPallet: !viewMode.showPallet,
      });
    }, 1000);
  };

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setSize(WIDTH, HEIGHT);
    console.log('heklo');
    camera.position.set(
      initialPosition.x,
      initialPosition.y,
      initialPosition.z,
    );

    //SET USER CONTROL AND ZOOM LIMIT
    const controls = new OrbitControls(camera);
    controls.maxDistance = 100;
    controls.minDistance = 20;

    const light = new THREE.AmbientLight(0xffffff, 5.0);

    const gridHelper = new THREE.GridHelper(400, 20, 0xb6bdc4, 0xb6bdc4);
    if (canvas.childElementCount?.length > 1) {
    }
    canvas.current.innerHTML = '';
    canvas.current.appendChild(renderer.domElement);

    scene.add(light, gridHelper);

    responceData.forEach((item) => {
      createSceneObjects(scene, item, viewMode.showPallet);
    });

    const animate = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      TWEEN.update();
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', function () {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
  });

  return (
    <>
      <button name='showPallet' onClick={changeObjectsView}>
        ShowPallet
      </button>
      <button onClick={inheritCamera}>inheritCamera</button>
      <button onClick={cameraZoomIn}>cameraZoomIn</button>
      <button onClick={cameraZoomOut}>cameraZoomOut</button>

      <div ref={canvas}></div>
    </>
  );
};

export default App;
