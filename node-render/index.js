const playwright = require('playwright');
const argv = require('yargs').argv;
const commander = require('commander'); // include commander in git clone of commander repo
const { option } = require('yargs');
const program = new commander.Command();


program
.option('-f, --json-file-link <dir>' , 'json file')
.option('-s , --json-data-string <JSON>', 'json data-string')
.option('-o , --img-save-dir <dir>', 'image save to directory')
.option('-w , --img-width <size>', 'image width')
.option('-h , --img-height <size>', 'image height')
.option('-i , --save-to-img', 'save to .jpg')
.option('-p , --save-to-png', 'save to .png')
.parse(process.argv);


const { jsonFileLink, 
        jsonDataString, 
        imgSaveDir, 
        imgWidth,
        imgHeight,
        saveToImg,
        saveToPng
      } = program
console.log(saveToPng);

const htmlContent = `
  <!doctype html>
  <html>
    <head><meta charset='UTF-8'><title>Test</title></head>
    <body>
    <style>
      body {
      margin: 0;
    }
      canvas {
      width: 100%;
      height: 100%;
    }

    </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r119/three.min.js"></script>
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                var WIDTH = window.innerWidth;
                var HEIGHT = window.innerHeight;
                
                var renderer = new THREE.WebGLRenderer({antialias:true});
                renderer.setSize(WIDTH, HEIGHT);
                renderer.setClearColor(0x000000);
                document.body.appendChild(renderer.domElement);
                
                var scene = new THREE.Scene();
                
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

                const createCanvasBoxSides = (scene, { size, complex, position }) => {
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
                    canvas[i] = document.createElement('canvas');
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
            
                createCanvasBoxSides(scene, boxData);
                
                const camera = new THREE.PerspectiveCamera(75,WIDTH / HEIGHT,0.1,1000);
                scene.add(camera);
                  camera.position.set(15, 15, 30);
                let gridHelper = new THREE.GridHelper(200, 16, 0xffffff, 0xffffff);
                gridHelper.position.y = 0;
                gridHelper.position.x = 0;
                scene.add(gridHelper);
                let light = new THREE.AmbientLight(0xffffff, 5.0);
                scene.add(light);
                function render() {
                    requestAnimationFrame(render);
                    renderer.render(scene, camera);
                }
                render();
            })
        </script>
    </body>
  </html>
`;


(async () => {
  const browser = await playwright['webkit'].launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `example.png` });
  await browser.close();
})();
