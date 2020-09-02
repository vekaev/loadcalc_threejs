import * as THREE from 'three/build/three.module.js';

const convertCoordinatesCube = (position, size) => {
  let calc = position + size / 2;
  return calc;
};

export const createBox = (scene, { size, complex, position }) => {
  const createCanvasBcg = (
    canvas,
    ctx,
    color = '#0088ff',
    firstAxis,
    secondAxis,
  ) => {
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
  };

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

    createCanvasBcg(
      canvas[i],
      ctx[i],
      'red',
      axisQuantity[i][0],
      axisQuantity[i][1],
    );
    texture[i].needsUpdate = true;
  }

  let cubeMaterials = [
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

export const createCylinder = (scene) => {
  const createCanvasBcg = (canvas, ctx, color = '#0088ff', amount) => {
    for (let i = 0; i <= amount; i++) {
      ctx.fillStyle = color;
      ctx.fillRect(
        0,
        (i * canvas.height) / amount,
        361,
        canvas.height / amount,
      );
    }
    for (let i = 0; i <= canvas.height; i += canvas.height / amount) {
      console.log((i * canvas.height) / amount);
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }
  };

  const canvas = document.createElement(`canvas`);
  const ctx = canvas.getContext('2d');
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  ctx.imageSmoothingEnabled = false;

  createCanvasBcg(canvas, ctx, '#0088ff', 10);

  let cylinderMaterials = [
    new THREE.MeshBasicMaterial({ map: texture }),
    new THREE.MeshBasicMaterial({ color: 0x0088ff }),
    new THREE.MeshBasicMaterial({ color: 0x0088ff }),
  ];
  let cylinderGeometry = new THREE.CylinderGeometry(5, 5, 10, 361);

  let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterials);

  cylinder.position.set(
    convertCoordinatesCube(0, 5),
    convertCoordinatesCube(0, 10),
    convertCoordinatesCube(0, 5),
  );

  scene.add(cylinder);
};
