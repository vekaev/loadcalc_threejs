import React, { useEffect, useRef, useState, useCallback } from 'react';
import './main.scss';
import { responceData } from './responceData';

import WebGl from './components/WebGl';
import TWEEN from '@tweenjs/tween.js';
import Switcher from './components/Switcher';

const App = (callback, inputs) => {
  //NEED TO ADD RENDERING STATUS
  const [viewMode, setViewMode] = useState({
    cargoRendering: 'cargo',
    showPallet: false,
    loading: false,
    height: 837,
    width: 1200,
    showCanvas: false,
  });

  const childRef = useRef();
  const canvasContainer = useRef(null);

  const stopLoading = () => {
    setViewMode({ ...viewMode, loading: false });
  };

  const setCanvasSize = () => {
    setViewMode({
      ...viewMode,
      width: canvasContainer.current.offsetWidth,
      height: canvasContainer.current.offsetHeight,
      showCanvas: true,
    });
  };
  const changeObjectsView = (command) => {
    // setViewMode({
    //   ...viewMode,
    //   loading: true,
    //   cargoRendering: command,
    // });
    //
    childRef.current.inheritCamera();

    setTimeout(() => {
      setViewMode({
        ...viewMode,
        cargoRendering: command,
        showPallet: command == 'pallet',
        loading: false,
      });
    }, 1000);
  };

  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => {
      // window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  console.log('main rerender');
  return (
    <div ref={canvasContainer} className='canvas'>
      <div className='canvas__main'>
        <Switcher changeObjectsView={changeObjectsView} />
        {/*<div className='btn-list'>*/}
        {/*  <button*/}
        {/*    className='btn__inherit'*/}
        {/*    onClick={() => {*/}
        {/*      childRef.current.inheritCamera();*/}
        {/*    }}*/}
        {/*  ></button>*/}
        {/*</div>*/}

        {/*<button*/}
        {/*  onClick={() => {*/}
        {/*    childRef.current.zoom(10);*/}
        {/*  }}*/}
        {/*>*/}
        {/*  zoom*/}
        {/*</button>*/}
        {viewMode.showCanvas && (
          <WebGl
            ref={childRef}
            stopLoading={stopLoading}
            height={viewMode.height}
            width={viewMode.width}
            data={responceData}
            viewPallet={viewMode.showPallet}
          />
        )}
      </div>
    </div>
  );
};

export default App;

// {/*<button onClick={inheritCamera}>inheritCamera</button>*/}
// {/*<button name='zoomIn' onClick={() => zoomModel(false, 4)}>*/}
// {/*  cameraZoomIn*/}
// {/*</button>*/}
// {/*<button name='zoomOut' onClick={() => zoomModel(true, 4)}>*/}
// {/*  cameraZoomOut*/}
// {/*</button>*/}

// const defaultParam = {
//   WIDTH:
//     canvasContainer.current?.offsetWidth || window.innerWidth >= 1200
//       ? 1200
//       : window.innerWidth,
//   HEIGHT: canvasContainer.current?.offsetHeight || 500,
// };

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
