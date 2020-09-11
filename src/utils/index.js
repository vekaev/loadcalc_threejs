import * as THREE from 'three/build/three.module.js';

const sizeCoefficient = 30;

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

function convertCoordinatesCube(location, size) {
  return location + size / 2;
}

function wrapCanvasBcgText(context, text, x, y, maxWidth, lineHeight) {
  let words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function createBox(scene, { size, complex, location, uid }) {
  const color = getRandomColor();
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
    xw: size.x / sizeCoefficient,
    yw: size.y / sizeCoefficient,
    zw: size.z / sizeCoefficient,
    xq: complex.x,
    yq: complex.y,
    zq: complex.z,
    posX: location.x / sizeCoefficient,
    posY: location.y / sizeCoefficient,
    posZ: location.z / sizeCoefficient,
    text: uid,
  };
  const { xw, xq, yw, yq, zw, zq, posX, posY, posZ, text } = convertData;

  let cubeGeometry = new THREE.BoxGeometry(xw, zw, yw);

  const axisQuantity = [
    [xq, yq],
    [xq, zq],
    [yq, zq],
  ];
  const axisWidth = [
    [xw, yw],
    [xw, zw],
    [yw, zw],
  ];
  let texture = [];
  let canvas = [];
  let ctx = [];

  for (let i = 0; i < 3; i++) {
    canvas[i] = document.createElement(`canvas`);
    canvas[i].width = axisWidth[i][0] * sizeCoefficient;
    canvas[i].height = axisWidth[i][1] * sizeCoefficient;
    ctx[i] = canvas[i].getContext('2d');
    ctx[i].clearRect(0, 0, canvas[i].width, canvas[i].height);
    ctx[i].imageSmoothingEnabled = false;
    texture[i] = new THREE.Texture(canvas[i]);

    createCanvasBcg(
      canvas[i],
      ctx[i],
      color,
      axisQuantity[i][0],
      axisQuantity[i][1],
    );
    let maxWidth = canvas[i].width - 10;

    if (maxWidth >= 350 && i === 1) {
      ctx[i].font = '20px Arial';
      ctx[i].fillStyle = '#fff';
      wrapCanvasBcgText(ctx[i], text, 10, 30, maxWidth, 22);
    }
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
    convertCoordinatesCube(posZ, zw),
    convertCoordinatesCube(posY, yw),
  );
}

function createCylinder(scene, { height, radius, complex, location, uid }) {
  const color = getRandomColor();

  const convertData = {
    convertHeight: height / sizeCoefficient,
    convertRadius: radius / sizeCoefficient,
    quantity: complex.z,
    posX: location.x / sizeCoefficient,
    posY: location.y / sizeCoefficient,
    posZ: location.z / sizeCoefficient,
    text: uid,
  };

  const {
    convertHeight,
    convertRadius,
    quantity,
    posX,
    posY,
    posZ,
    text,
  } = convertData;

  const createCanvasBcg = (canvas, ctx, color = '#0088ff', amount) => {
    for (let i = 0; i <= amount; i++) {
      ctx.fillStyle = color;
      ctx.fillRect(
        0,
        (i * canvas.height) / amount,
        canvas.width,
        canvas.height / amount,
      );
    }
    for (let i = 0; i <= canvas.height; i += canvas.height / amount) {
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }
  };

  const canvas = document.createElement(`canvas`);

  canvas.width = Math.PI * convertRadius * 2 * sizeCoefficient;
  canvas.height = convertHeight * sizeCoefficient;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  ctx.imageSmoothingEnabled = false;

  createCanvasBcg(canvas, ctx, color, quantity);

  let maxWidth = canvas.width - 10;
  ctx.font = '5px Arial';
  ctx.fillStyle = '#fff';
  wrapCanvasBcgText(ctx, text, 5, 8, maxWidth, 32);
  let cylinderMaterials = [
    new THREE.MeshBasicMaterial({ map: texture }),
    new THREE.MeshBasicMaterial({ color: color }),
    new THREE.MeshBasicMaterial({ color: color }),
  ];

  let cylinderGeometry = new THREE.CylinderGeometry(
    convertRadius,
    convertRadius,
    convertHeight,
    20,
  );

  let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterials);

  cylinder.position.set(posX, posZ + convertHeight / 2, posY);

  scene.add(cylinder);
}

export default function createSceneObjects(scene, containerObject, palletView) {
  let palletSize = {
    x: containerObject.size.x / containerObject.complex.x,
    y: containerObject.size.y / containerObject.complex.y,
    z: containerObject.size.z / containerObject.complex.z,
  };

  let pallet = containerObject;
  if (palletView) {
    if (pallet.type == 'pallet') {
      let data = {
        size: containerObject.size,
        complex: containerObject.complex,
        location: containerObject.location,
        uid: containerObject.uid,
      };
      createBox(scene, data);
    }
    return;
  }

  for (let x = 0; x < pallet.complex.x; ++x) {
    for (let y = 0; y < pallet.complex.y; ++y) {
      for (let z = 0; z < pallet.complex.z; ++z) {
        for (let j in pallet.children) {
          let obj = pallet.children[j];

          let location = {
            x: obj.location.x + x * palletSize.x,
            y: obj.location.y + y * palletSize.y,
            z: obj.location.z + z * palletSize.z,
          };

          switch (obj.form) {
            case 'box':
              let boxData = {
                size: obj.size,
                complex: obj.complex,
                location: location,
                uid: obj.uid,
              };
              createBox(scene, boxData);
              break;

            case 'roll':
              let rollData = {
                height: obj.height,
                radius: obj.radius,
                complex: obj.complex,
                location: location,
                uid: obj.uid,
              };
              createCylinder(scene, rollData);
              break;
          }
        }
      }
    }
  }
}
