import React, { useState } from 'react';

export default function Switcher({ changeObjectsView }) {
  const [renderStatus, setRenderStatus] = useState('cargo');

  const handleChange = (e) => {
    setRenderStatus(e.target.value);
    changeObjectsView(e.target.value);
  };

  return (
    <div className={`switcher ${renderStatus}`}>
      <div
        className={`switcher-item ${renderStatus == 'cargo' ? 'active' : ''}`}
      >
        <input
          type='radio'
          id='radioBtnCargo'
          name='viewMode'
          defaultChecked={renderStatus == 'cargo'}
          // disabled={viewMode.loading}
          value={'cargo'}
          onChange={handleChange}
        />
        <label htmlFor='radioBtnCargo'>
          <span className='switcher-item__icon'></span>Cargo
        </label>
      </div>
      <div
        className={`switcher-item ${renderStatus == 'pallet' ? 'active' : ''}`}
      >
        <input
          type='radio'
          id='radioBtnPallets'
          name='viewMode'
          defaultChecked={renderStatus == 'pallet'}
          // disabled={viewMode.loading}
          value={'pallet'}
          onChange={handleChange}
        />
        <label htmlFor='radioBtnPallets'>
          <span className='switcher-item__icon'></span>Pallets
        </label>
      </div>
    </div>
  );
}
