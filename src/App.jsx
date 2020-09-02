import React, { useEffect, useRef, useState } from 'react';
import './main.scss';
import * as THREE from 'three/build/three.module.js';
import { createCanvasBox } from './utils/index';

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
    z: 120,
  },
  position: {
    x: 200,
    y: 0,
    z: 880,
  },
  complex: {
    x: 5,
    y: 3,
    z: 1,
  },
};

const App = () => {
  const el = useRef(null);
  const scene = new THREE.Scene();

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xf8fafd);
    renderer.setSize(WIDTH, HEIGHT);

    const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.5, 1000);
    camera.position.set(15, 15, 30);

    const controls = new OrbitControls(camera);

    const light = new THREE.AmbientLight(0xffffff, 5.0);
    const gridHelper = new THREE.GridHelper(100, 20, 0xb6bdc4, 0xb6bdc4);

    var geometry = new THREE.CylinderGeometry(5, 5, 5, 361);
    var material = new THREE.MeshBasicMaterial({ color: 0x0088ff });
    var cylinder = new THREE.Mesh(geometry, material);

    var lineGeometry = new THREE.EdgesGeometry(cylinder.geometry); // or WireframeGeometry
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    var edges = new THREE.LineSegments(lineGeometry, lineMaterial);

    cylinder.add(edges);
    scene.add(cylinder);

    createCanvasBox(scene, boxData);

    el.current.appendChild(renderer.domElement);

    scene.add(light, gridHelper);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', function() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
  });

  return <div ref={el}></div>;
};

export default App;
