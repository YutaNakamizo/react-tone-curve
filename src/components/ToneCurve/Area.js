import React from 'react';
import merge from 'deepmerge';

const styles = {
  root: {
    position: 'relative',
    backgroundColor: '#444',
  },  
};

export const ToneCurveArea = ({
  size = 320,
  styles: propsStyles = {},
  children,
  ...props
}) => {
  const _styles = merge.all([
    styles,
    propsStyles,
    {
      root: {
        width: size,
        height: size,
      },
    },
  ]);
  return (
    <div
      style={_styles.root}
    >
      {children}
    </div>
  );
};

