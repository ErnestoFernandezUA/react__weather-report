import { useEffect, useRef, useState } from 'react';
import { RiLoader4Fill } from 'react-icons/ri';
import './Loader.scss';

export const Loader: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        setSize(Math.max(ref.current.offsetWidth, ref.current.offsetHeight)
        > 200 ? 40 : 15);
      }
    };

    updateSize();

    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="Loader" ref={ref}>
      <div className="Loader__container">
        <RiLoader4Fill size={size} />
      </div>
    </div>
  );
};
