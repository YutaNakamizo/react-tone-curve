import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import merge from 'deepmerge';
import { ToneCurveCurvePoint as CurvePoint } from './Curve/Point';

const styles = {
  root: {
    width: 'calc(100% - 16px)',
    height: 'calc(100% - 16px)',
    padding: 8,
  },
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  curve: {
    cursor: 'crosshair',
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
  
  const handlePointMouseDown = (e, index) => {  
    for(const p of pointsRef.current) p.active = false;
    const point = pointsRef.current[index];
    point.active = true;
    point.focused = true;
    updatePoints();
  };
  useEffect(() => {
    const handlePointMouseMove = e => {
      const pointIndex = pointsRef.current.findIndex(p => p.focused);
      if(pointIndex < 0 || pointIndex + 1 > pointsRef.current.length) return;
      const point = pointsRef.current[pointIndex];
      const prevPoint = (pointIndex === 0) ? null : pointsRef.current[pointIndex - 1];
      const nextPoint = (pointIndex + 1 === pointsRef.current.length) ? null : pointsRef.current[pointIndex + 1];
      if(!point) return;
      const {
        top,
        left,
      } = svgRef.current.getBoundingClientRect();
      const x = point.fixed?.includes('x') ? point.x : (e.pageX - (window.pageXOffset + left)) / (size - 16);
      const y = point.fixed?.includes('y') ? point.y : 1 - ((e.pageY - (window.pageYOffset + top)) / (size - 16));
      point.x = x > 1 ? 1 : (x < 0 ? 0 : x);
      point.y = y > 1 ? 1 : (y < 0 ? 0 : y);
      if(prevPoint !== null && point.x < prevPoint.x) {
        pointsRef.current[pointIndex - 1] = pointsRef.current.splice(pointIndex, 1, pointsRef.current[pointIndex - 1])[0];
      }
      else if(nextPoint !== null && point.x > nextPoint.x) {  
        pointsRef.current[pointIndex] = pointsRef.current.splice(pointIndex + 1, 1, pointsRef.current[pointIndex])[0];
      }
      updatePoints();
    };
    const handlePointMouseUp = (e, index) => {
      const point = pointsRef.current.find(p => p.focused);
      if(!point) return;
      point.focused = false;
      updatePoints();
    };

    window.addEventListener('mousemove', handlePointMouseMove);
    window.addEventListener('mouseup', handlePointMouseUp);
    return () => {
      window.removeEventListener('mousemove', handlePointMouseMove);
      window.removeEventListener('mouseup', handlePointMouseUp);
    };
  }, []);

  const createNewPoint = e => {
    console.log(e);
    const {
      top,
      left,
    } = svgRef.current.getBoundingClientRect();
    const x = (e.pageX - (window.pageXOffset + left)) / (size - 16);
    const y = 1 - ((e.pageY - (window.pageYOffset + top)) / (size - 16));
    const nextIndex = pointsRef.current.findIndex(p => p.x > x);
    pointsRef.current.splice(nextIndex, 0, {  
      x,
      y,
      active: true,
      focused: true,
      protected: false,
      fixed: [],
    });
    updatePoints();
  };

  const _styles = merge(styles, propsStyles);
  return (
    <div
      style={_styles.root}
    >
      <div
        style={_styles.container}
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
            strokeWidth={2 / size}
            fill="none"
            pointerEvents="stroke"
            style={_styles.curve}
            onMouseDown={createNewPoint}
          />
        </svg>

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
            onMouseDown={e => handlePointMouseDown(e, index)}
          />
        ))}
      </div>
    </div>
  );
};

