import React from 'react';
import ToneCurve from '../../src';

const styles = {
  toneCurve: {
    area: {
      root: {
        //backgroundColor: '#ddd',
      },
    },
  },
};

export const App = () => {
  return (
    <ToneCurve
      size={420}
      styles={styles.toneCurve}
    />
  );
};

