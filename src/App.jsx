import React, { useEffect, useRef, useState } from 'react';
import './main.scss';
import * as THREE from 'three/build/three.module.js';
import TWEEN from '@tweenjs/tween.js';
import { responceData } from './responceData';
import createSceneObjects from './utils';

const OrbitControls = require('three-orbit-controls')(THREE);

const defaultParam = {
  WIDTH: 100,
  HEIGHT: 100,
};

const { WIDTH, HEIGHT } = defaultParam;

const App = () => {
  //NEED TO ADD RENDERING STATUS
  const [viewMode, setViewMode] = useState({
    showPallet: false,
    rendering: false,
  });
  const renderer = new THREE.WebGLRenderer();
  const canvas = useRef(null);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.5, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);

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

  // function cameraZoom(e) {
  //   const direction = e.target.name;
  //   const { x, y, z } = camera.position;
  //
  //   function inheritPosition(direction, inherit) {
  //     console.log(camera.position.z);
  //     if (camera.position.z > 20 && camera.position.z < 100) {
  //       switch (direction) {
  //         case 'zoomIn':
  //           return inherit > 0
  //             ? (inherit = inherit - 5)
  //             : (inherit = inherit + 5);
  //           break;
  //         case 'zoomOut':
  //           return inherit > 0
  //             ? (inherit = inherit + 5)
  //             : (inherit = inherit - 5);
  //           break;
  //       }
  //     } else {
  //       inheritCamera();
  //     }
  //   }
  //
  //   let zoom = new TWEEN.Tween(camera.position)
  //     .to(
  //       {
  //         x: inheritPosition(direction, x),
  //         y: inheritPosition(direction, y),
  //         z: inheritPosition(direction, z),
  //       },
  //       500,
  //     )
  //     .start();
  // }

  // function zoomModel(isZoomOut, scale) {
  //   if (isZoomOut) {
  //     controls.dollyIn(scale);
  //   } else {
  //     controls.dollyOut(scale);
  //   }
  //   scope.update();
  // }

  const changeObjectsView = (command) => {
    inheritCamera();
    // clear cash
    setTimeout(() => {
      setViewMode({
        ...viewMode,
        showPallet: command,
        rendering: false,
      });
    }, 1000);
  };

  useEffect(() => {
    renderer.setClearColor(0xffffff);
    renderer.setSize(WIDTH, HEIGHT);
    camera.position.set(
      initialPosition.x,
      initialPosition.y,
      initialPosition.z,
    );

    //SET USER CONTROL AND ZOOM LIMIT
    const controls = new OrbitControls(camera);
    controls.maxDistance = 100;
    // controls.minDistance = 30;

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
      renderer.setSize(WIDTH, HEIGHT);
      TWEEN.update();
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', function () {
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    });
  });

  return (
    <div className='canvas-module'>
      <div className='switcher'>
        <div className='switcher-item'>
          <input
            type='radio'
            id='radioBtnCargo'
            name='viewMode'
            defaultChecked={!viewMode.showPallet}
            disabled={viewMode.rendering}
            onChange={() => {
              changeObjectsView(false);
            }}
          />
          <label htmlFor='radioBtnCargo'>
            <span className='switcher-item__icon'></span>Cargo
          </label>
        </div>
        <div className='switcher-item'>
          <input
            type='radio'
            id='radioBtnPallets'
            name='viewMode'
            defaultChecked={viewMode.showPallet}
            disabled={viewMode.rendering}
            onChange={() => {
              changeObjectsView(true);
            }}
          />
          <label htmlFor='radioBtnPallets'>
            <span className='switcher-item__icon'></span>Pallets
          </label>
        </div>
      </div>
      <button onClick={inheritCamera}>inheritCamera</button>
      {/*<button name='zoomIn' onClick={() => zoomModel(false, 4)}>*/}
      {/*  cameraZoomIn*/}
      {/*</button>*/}
      {/*<button name='zoomOut' onClick={() => zoomModel(true, 4)}>*/}
      {/*  cameraZoomOut*/}
      {/*</button>*/}
      <div ref={canvas}></div>
    </div>
  );
};

export default App;
