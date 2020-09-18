document.addEventListener('DOMContentLoaded', () => {
  const sizeCoefficient = 50;

  const containerSize = {
    x: responceData?.size.x / sizeCoefficient || 10,
    y: responceData?.size.y / sizeCoefficient || 10,
    z: responceData?.size.z / sizeCoefficient || 10,
  };

  const cameraPosition = {
    x: 5,
    y: 6,
    z: 7,
  };

  let initialPosition = {
    x: containerSize.x / 2,
    y: containerSize.y / 2,
    z: containerSize.z / 2,
  };

  let WIDTH = window.innerWidth;
  let HEIGHT = window.innerHeight;

  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  let zoomCoefficient = 5
  const camera = new THREE.OrthographicCamera(
      WIDTH / (- 100 - (zoomIn * zoomCoefficient)),
      WIDTH / (100 + (zoomIn * zoomCoefficient)),
      HEIGHT / (100 + (zoomIn * zoomCoefficient)),
      HEIGHT / (- 100 - (zoomIn * zoomCoefficient)),
      1,
      1000 );

  // PerspectiveCamera(75 - (zoomIn * 5) , WIDTH / HEIGHT, 0.5, 1000);
  camera.target = initialPosition;
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  const scene = new THREE.Scene();

  const light = new THREE.AmbientLight(0xffffff, 5.0);
  // const gridHelper = new THREE.GridHelper(400, 80, 0xb6bdc4, 0xb6bdc4);

  let maxSizeParam = function() {
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
    window.createSceneObjects(scene, item, true);
  });

  scene.add(light, 
    // gridHelper
    );
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff);

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

  document.body.appendChild(renderer.domElement);

  function render() {
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();
});