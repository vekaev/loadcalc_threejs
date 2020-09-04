import React, { useEffect, useRef, useState } from 'react';
import './main.scss';
import * as THREE from 'three/build/three.module.js';
import { createBox, createCylinder } from './utils/index';
import { responceData } from './responceData';
import { showResult } from './utils';
const OrbitControls = require('three-orbit-controls')(THREE);

const defaultParam = {
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight,
};
const { WIDTH, HEIGHT } = defaultParam;

const boxData = {
  size: {
    x: 750,
    y: 990,
    z: 1200,
  },
  location: {
    x: 200,
    y: 0,
    z: 880,
  },
  complex: {
    x: 5,
    y: 3,
    z: 5,
  },
  info:
    '20x20 container info 123456789 hello worldgffretrfgdfgdfg dfsdsdfsdfsdfs',
};

const App = () => {
  const [palletView, setPalletView] = useState(false);
  const canvas = useRef(null);
  const scene = new THREE.Scene();

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    // f8fafd
    renderer.setSize(WIDTH, HEIGHT);

    const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.5, 1000);
    camera.position.set(20, 15, 25);

    //SET USER CONTROL AND ZOOM LIMIT
    const controls = new OrbitControls(camera);
    controls.maxDistance = 100;
    controls.minDistance = 20;

    const light = new THREE.AmbientLight(0xffffff, 5.0);

    const gridHelper = new THREE.GridHelper(400, 20, 0xb6bdc4, 0xb6bdc4);

    responceData.forEach((item) => {
      showResult(scene, item);
    });

    canvas.current.appendChild(renderer.domElement);

    scene.add(light, gridHelper);

    const animate = () => {
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
      {/*<button*/}
      {/*  style={{ position: 'fixed' }}*/}
      {/*  onClick={() => {*/}
      {/*    setPalletView(!palletView);*/}
      {/*  }}*/}
      {/*>*/}
      {/*  ShowPallet*/}
      {/*</button>*/}
      <div ref={canvas}></div>
    </>
  );
};

export default App;
