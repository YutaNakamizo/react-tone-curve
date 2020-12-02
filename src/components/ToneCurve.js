import React from 'react';
import merge from 'deepmerge';
import { ToneCurveArea } from './ToneCurve/Area';
import { ToneCurveCurve } from './ToneCurve/Curve';

const styles = {
};

export const ToneCurve = ({
  size = 320,
  styles: propsStyles = {},
  ...props
}) => {
  const _styles = merge(styles, propsStyles);
  return (
    <ToneCurveArea
      {...{
        size,
      }}
      styles={_styles.area}
    >
      <ToneCurveCurve
        {...{
          size,
        }}
        styles={_styles.curve}
      />
    </ToneCurveArea>
  );
};

