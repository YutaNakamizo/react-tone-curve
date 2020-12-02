import React from 'react';
import merge from 'deepmerge';

export const ToneCurveCurvePoint = ({
  x,
  y,
  active,
  focused,
  size,
  ...props
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x * (size - 16) - 6,
        top: (1 - y) * (size - 16) - 6,
        width: 8,
        height: 8,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#fff',
        backgroundColor: (active || focused) ? '#fff' : '#000',
        cursor: 'crosshair',
      }}
      {...props}
    />
  );
};

