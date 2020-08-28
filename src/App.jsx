import React, { useEffect, useRef, useState } from 'react';
import './main.scss';
import * as THREE from 'three/build/three.module.js';
import { Canvas, useFrame } from 'react-three-fiber';
// import { OrbitControls } from 'drei';
import { Physics, useBox } from 'use-cannon';

var OrbitControls = require('three-orbit-controls')(THREE);

function Box({ pos }) {
  // This reference will give us direct access to the mesh
  const ref = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  let newPosition = [pos[0] + 5 / 2, pos[1] + 3, pos[2] + 5 / 2];

  return (
    <mesh
      position={newPosition}
      ref={ref}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxBufferGeometry attach='geometry' args={[5, 5, 5]} />
      <meshBasicMaterial
        attach='material'
        color={'#095DDB'}
        wireframe={!active && !hovered}
      />
    </mesh>
  );
}

const Pallet = (props) => {
  const mesh = useRef();

  return (
    <mesh {...props} ref={mesh}>
      <boxBufferGeometry attach='geometry' args={[5, 1, 10]} />
      <meshStandardMaterial attach='material' color={'0x0088ff'} />
    </mesh>
  );
};

const Container = (props) => {
  const mesh = useRef();

  let palletParams = [120, 0.5, 20];
  let argsParams = [120, 20 + palletParams[1], 20];
  let positionParams = [0, argsParams[1] / 2, 0];

  return (
    <group>
      <mesh position={positionParams} {...props} ref={mesh}>
        <boxBufferGeometry attach='geometry' args={argsParams} />
        <meshStandardMaterial attach='material' color={'#AFB9D2'} wireframe />
      </mesh>
      <mesh position={[0, palletParams[1] / 2, 0]} {...props} ref={mesh}>
        <boxBufferGeometry attach='geometry' args={palletParams} />
        <meshStandardMaterial attach='material' color={'#AFB9D2'} />
      </mesh>
    </group>
  );
};

const App = () => {
  const el = useRef(null);
  const scene = new THREE.Scene();

  function changeCanvas(canvas, ctx, color = '#0088ff', firstAxis, secondAxis) {
    for (let i = 0; i <= secondAxis; i++) {
      for (let j = 0; j <= firstAxis; j++) {
        ctx.fillStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.fillRect(
          j * (canvas.width / firstAxis),
          i * (canvas.height / secondAxis),
          canvas.width,
          canvas.height,
        );

        ctx.strokeRect(
          j * (canvas.width / firstAxis),
          i * (canvas.height / secondAxis),
          canvas.width,
          canvas.height,
        );
      }
    }
  }

  const convertCoordinatesCube = (position, size) => {
    let calc = position + size / 2;
    return calc;
  };

  const createCanvasBoxSides = ({ size, complex, position }) => {
    const convertData = {
      xw: size.x / 100,
      yw: size.y / 100,
      zw: size.z / 100,
      xq: complex.x,
      yq: complex.y,
      zq: complex.z,
      posX: position.x / 100,
      posY: position.y / 100,
      posZ: position.z / 100,
    };

    const { xw, xq, yw, yq, zw, zq, posX, posY, posZ } = convertData;

    let cubeGeometry = new THREE.BoxGeometry(xw, zw, yw);

    const axisQuantity = [
      [xq, yq],
      [xq, zq],
      [yq, zq],
    ];
    let texture = [];
    let canvas = [];
    let ctx = [];

    for (let i = 0; i < 3; i++) {
      canvas[i] = document.createElement(`canvas`);
      ctx[i] = canvas[i].getContext('2d');
      ctx[i].imageSmoothingEnabled = false;

      texture[i] = new THREE.Texture(canvas[i]);

      changeCanvas(
        canvas[i],
        ctx[i],
        'red',
        axisQuantity[i][0],
        axisQuantity[i][1],
      );
      texture[i].needsUpdate = true;
    }

    var cubeMaterials = [
      new THREE.MeshBasicMaterial({ map: texture[2] }),
      new THREE.MeshBasicMaterial({ map: texture[2] }),
      new THREE.MeshBasicMaterial({ map: texture[0] }),
      new THREE.MeshBasicMaterial({ map: texture[0] }),
      new THREE.MeshBasicMaterial({ map: texture[1] }),
      new THREE.MeshBasicMaterial({ map: texture[1] }),
    ];

    let cube = new THREE.Mesh(cubeGeometry, cubeMaterials);

    scene.add(cube);

    cube.position.set(
      convertCoordinatesCube(posX, xw),
      convertCoordinatesCube(posY, yw),
      convertCoordinatesCube(posZ, zw),
    );
  };

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer();
    //set bcg color
    renderer.setClearColor(0x000000);

    const camera = new THREE.PerspectiveCamera(
      //view angle
      75,
      //proportion
      window.innerWidth / window.innerHeight,
      //distance to
      0.1,
      //distance from
      1000,
    );

    let boxData = {
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

    createCanvasBoxSides(boxData);

    //set camera position
    camera.position.set(15, 15, 30);

    renderer.setSize(window.innerWidth, window.innerHeight);

    var controls = new OrbitControls(camera);

    controls.minZoom = 0.5;
    controls.maxZoom = 2;

    var light = new THREE.AmbientLight(0xffffff, 5.0);

    scene.add(light);

    el.current.appendChild(renderer.domElement);

    var gridHelper = new THREE.GridHelper(200, 16, 0xffffff, 0xffffff);
    gridHelper.position.y = 0;
    gridHelper.position.x = 0;
    scene.add(gridHelper);
    // var geometry = new THREE.EdgesGeometry(cube.geometry); // or WireframeGeometry
    var material = new THREE.LineBasicMaterial({
      color: 0xff00ff,
      linewidth: 8,
      linecap: 'round',
      linejoin: 'round',
    });
    // var edges = new THREE.LineSegments(geometry, material);
    // cube.add(edges);

    // changeCanvas();
    const animate = () => {
      requestAnimationFrame(animate);
      // for (let i = 0; i < 3; i++) {
      //   texture[1].needsUpdate = true;
      // }

      controls.update();
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', function () {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    animate();
  });
  return <div ref={el}></div>;
};

export default App;

//   <Canvas
//     camera={{ fov: 75, position: [10, 20, 20] }}
//     colorManagement
//     style={{ height: '100vh', width: '100vw' }}
//   >
//     {/*<div ref={el}></div>*/}
//     <Container />
//     <ambientLight />
//
//     <pointLight position={[10, 10, 10]} />
//     <Physics>
//       <Box pos={[0, 0, 0]} />
//       <Box pos={[-5, 0, -5]} />
//       <Box pos={[-5, 0, 0]} />
//       <Box pos={[0, 0, -5]} />
//       <Box pos={[-10, 0, -5]} />
//       <Box pos={[-10, 0, 0]} />
//       <Box pos={[-15, 0, 0]} />
//       <Box pos={[-15, 0, -5]} />
//       <Box pos={[-10, 5, -5]} />
//       <Box pos={[-10, 5, 0]} />
//       <Box pos={[-15, 5, 0]} />
//       <Box pos={[-15, 5, -5]} />
//     </Physics>
//     <gridHelper args={[400, 50, `gray`, `gray`]} />
//     <OrbitControls />
//   </Canvas>
// );
// // ;

// const el = useRef(null);
//
// var ball = {
//   rotationX: 0,
//   rotationY: 0,
//   rotationZ: 0,
// };
//
// useEffect(() => {
//   var gui = new dat.GUI();
//   gui.add(ball, 'rotationX').min(-0.2).max(0.2).step(0.001);
//   gui.add(ball, 'rotationY').min(-0.2).max(0.2).step(0.001);
//   gui.add(ball, 'rotationZ').min(-0.2).max(0.2).step(0.001);
//   const renderer = new THREE.WebGLRenderer();
//   //set bcg color
//   renderer.setClearColor(0x000000);
//
//   var edgeGeometry = new THREE.BoxBufferGeometry(100, 100, 100);
//   var edges = new THREE.EdgesGeometry(edgeGeometry);
//
//   const scene = new THREE.Scene();
//
//   const camera = new THREE.PerspectiveCamera(
//     //view angle
//     75,
//     //proportion
//     window.innerWidth / window.innerHeight,
//     //distance to
//     0.1,
//     //distance from
//     1000,
//   );
//   //set camera position
//   camera.position.set(5, 5, 10);
//
//   renderer.setSize(window.innerWidth, window.innerHeight);
//
//   var controls = new OrbitControls(camera);
//
//   controls.minZoom = 0.5;
//   controls.maxZoom = 2;
//
//   var light = new THREE.AmbientLight(0xffffff, 5.0);
//
//   scene.add(light);
//
//   el.current.appendChild(renderer.domElement);
//
//   //Создаем плоскость
//   const planeGeometry = new THREE.PlaneGeometry(10, 5, 12, 12);
//
//   const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
//   const sphereGeometry = new THREE.SphereGeometry(6, 20, 20);
//
//   const planeMaterial = new THREE.MeshBasicMaterial({
//     color: 0x0088ff,
//     wireframe: true,
//   });
//   // const cubeMaterial = new THREE.MeshBasicMaterial({
//   //   color: 0x00ff00,
//   //   wireframe: true,
//   // });
//
//   var cubeMaterials = [
//     new THREE.MeshLambertMaterial({
//       color: 0xd7b1ee,
//       side: THREE.DoubleSide,
//     }),
//     new THREE.MeshLambertMaterial({
//       color: 0xd7b1ee,
//       side: THREE.DoubleSide,
//     }),
//     new THREE.MeshLambertMaterial({
//       color: 0xd7b1ee,
//       side: THREE.DoubleSide,
//     }),
//     new THREE.MeshLambertMaterial({
//       color: 0xd7b1ee,
//       side: THREE.DoubleSide,
//     }),
//     new THREE.MeshLambertMaterial({
//       color: 0x00ff00,
//       side: THREE.DoubleSide,
//     }),
//     new THREE.MeshLambertMaterial({
//       color: 0xd7b1ee,
//       side: THREE.DoubleSide,
//     }),
//   ];
//
//   // // Create a MeshFaceMaterial, which allows the cube to have different materials on each face
//   // var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
//
//   const sphereMaterial = new THREE.MeshBasicMaterial({
//     color: 0x0000f0,
//     wireframe: true,
//     vertexColors: THREE.FaceColors,
//   });
//
//   const containerFloar = new THREE.Mesh(planeGeometry, planeMaterial);
//   const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
//   const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//
//   var gridHelper = new THREE.GridHelper(200, 16, 0xffffff, 0xffffff);
//   gridHelper.position.y = -1;
//   gridHelper.position.x = 0;
//   scene.add(gridHelper);
//   var geometry = new THREE.EdgesGeometry(cube.geometry); // or WireframeGeometry
//   var material = new THREE.LineBasicMaterial({
//     color: 0xff00ff,
//     linewidth: 8,
//     linecap: 'round',
//     linejoin: 'round',
//   });
//   var edges = new THREE.LineSegments(geometry, material);
//   cube.add(edges);
//   scene.add(cube);
//
//   const animate = function () {
//     requestAnimationFrame(animate);
//     // cube.rotation.x += 0.01;
//     cube.rotation.x += ball.rotationX;
//     cube.rotation.y += ball.rotationY;
//     cube.rotation.z += ball.rotationZ;
//     containerFloar.rotation.x += 0.01;
//     // containerFloar.rotation.y += 0.01;
//     // cube2.rotation.y -= 0.02;
//
//     controls.update();
//     renderer.render(scene, camera);
//   };
//   window.addEventListener('resize', function () {
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//   });
//   animate();
// });
