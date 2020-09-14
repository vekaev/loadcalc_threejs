import React, { useEffect, useState } from 'react';

export default function Switcher({ changeObjectsView }) {
  const [renderStatus, setRenderStatus] = useState({
    status: 'cargo',
    disabled: false,
  });
  const { status, disabled } = renderStatus;

  let timerId;

  const handleChange = (e) => {
    let newValue = e.target.value;

    setRenderStatus({
      ...renderStatus,
      status: newValue,
      disabled: true,
    });

    changeObjectsView(newValue);

    timerId = setTimeout(() => {
      setRenderStatus({
        ...renderStatus,
        status: newValue,
        disabled: false,
      });
    }, 1500);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div
      className={`switcher 
                  switcher__${status} 
                  ${disabled && 'switcher__disabled'}`}
    >
      <div
        className={`switcher-item 
                    switcher-item__cargo
                    ${status == 'cargo' && 'active'}`}
      >
        <input
          type='radio'
          id='radioBtnCargo'
          name='viewMode'
          defaultChecked={status === 'cargo'}
          disabled={disabled}
          onBlur={() => {
            console.log('blur');
          }}
          value={'cargo'}
          onChange={handleChange}
        />
        <label htmlFor='radioBtnCargo'>
          <span className='label-icon'></span>
          <p>Cargo</p>
        </label>
      </div>
      <div
        className={`switcher-item 
                    switcher-item__pallet
                    ${status === 'pallet' && 'active'}`}
      >
        <input
          type='radio'
          id='radioBtnPallets'
          name='viewMode'
          defaultChecked={status === 'pallet'}
          disabled={disabled}
          value={'pallet'}
          onChange={handleChange}
        />
        <label htmlFor='radioBtnPallets'>
          <span className='label-icon'></span>
          <p>Pallets</p>
        </label>
      </div>
    </div>
  );
}
