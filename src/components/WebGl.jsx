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

const WebGl = forwardRef(
  ({ data, viewPallet, height, width, stopLoading }, ref) => {
    const canvas = useRef(null);
    const renderer = new THREE.WebGLRenderer();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.5, 1000);
    const controls = new OrbitControls(camera, renderer.domElement);
    let scene = new THREE.Scene();
    const light = new THREE.AmbientLight(0xffffff, 5.0);
    const gridHelper = new THREE.GridHelper(400, 20, 0xb6bdc4, 0xb6bdc4);

    data.forEach((item) => {
      createSceneObjects(scene, item, viewPallet);
    });

    useEffect(() => {
      scene.add(light, gridHelper);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0xffffff);
      renderer.setSize(width, height);
      controls.minDistance = 30;
      controls.maxDistance = 100;
      camera.position.set(
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
          .to(initialPosition, tweenDuration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start();
        let targetTween = new TWEEN.Tween(controls.target)
          .to({ x: 0, y: 0, z: 0 }, tweenDuration)
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
    console.log('canvas rerender');
    return (
      <>
        <div className='canvas' ref={canvas}></div>
      </>
    );
  },
);

export default React.memo(WebGl);
