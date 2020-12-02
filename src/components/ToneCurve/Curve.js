import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import merge from 'deepmerge';
import { ToneCurveCurvePoint as CurvePoint } from './Curve/Point';

const styles = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  svg: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 'calc(100% - 16px)',
    height: 'calc(100% - 16px)',
  },
  points: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 'calc(100% - 16px)',
    height: 'calc(100% - 16px)',
  },
};

export const ToneCurveCurve = ({
  size = 320,
  styles: propsStyles = {},
  ...props
}) => {
  const [ path, setPath ] = useState('M 0 1 C 1 0 1 0 1 0');
  const svgRef = useRef();
  const pathRef = useRef();
  const pointsRef = useRef([
    {
      x: 0,
      y: 0,
      active: false,
      focused: false,
      protected: true,
      fixed: [
        'x',
      ],
    },
    {
      x: 1,
      y: 1,
      active: false,
      focused: false,
      protected: true,
      fixed: [
        'x',
      ],
    },
  ]);
  const [ points, setPoints ] = useState([ ...pointsRef.current ]);
  const updatePoints = () => {
    setPoints([ ...pointsRef.current ]);
  };
  useEffect(() => {
    const renderPath = () => {
      const points = [ ...pointsRef.current ];
      const p0 = points.shift();
      const path = [
        `M ${p0.x} ${1 - p0.y}`
      ];
      for(const pN of points) {
        path.push(`C ${pN.x} ${1 - pN.y} ${pN.x} ${1 - pN.y} ${pN.x} ${1 - pN.y}`)
      }
      pathRef.current.setAttribute('d', path.join(' '));
    };
    renderPath();
  }, [
    points,
  ]);
  
  const handlePointDrag = (e, index) => {
    const point = pointsRef.current[index];
    const {
      top,
      left,
    } = svgRef.current.getBoundingClientRect();
    const x = point.fixed?.includes('x') ? point.x : (e.pageX - (window.pageXOffset + left)) / (size - 16);
    const y = point.fixed?.includes('y') ? point.y : 1 - ((e.pageY - (window.pageYOffset + top)) / (size - 16));
    point.x = x > 1 ? 1 : (x < 0 ? 0 : x);
    point.y = y > 1 ? 1 : (y < 0 ? 0 : y);
    updatePoints();
  };

  const _styles = merge(styles, propsStyles);
  return (
    <div
      style={_styles.root}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox="0 0 1 1"
        style={_styles.svg}
      >
        <path
          ref={pathRef}
          d={path}
          stroke="white"
          strokeWidth={1 / size}
          style={_styles.curve}
        />
      </svg>

      <div
        style={_styles.points}
      >
        {points.map(({
            x,
            y,
            active,
            focused,
          }, index) => (
          <CurvePoint
            key={index}
            size={size}
            x={x}
            y={y}
            active={active}
            focused={focused}
            onDrag={e => handlePointDrag(e, index)}
          />
        ))}
      </div>
    </div>
  );
};

