document.addEventListener('DOMContentLoaded', () => {
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  
  var renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x000000);
  document.body.appendChild(renderer.domElement);
  
  var scene = new THREE.Scene();

  responceData.forEach((item) => {
    window.createSceneObjects(scene, item, true);
  });

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