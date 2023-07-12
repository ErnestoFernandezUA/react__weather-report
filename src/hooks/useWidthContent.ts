import { useEffect, useState } from 'react';

export const useWidthContent = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const MARGIN_MOBILE_LEFT = 20;
  const MARGIN_MOBILE_RIGHT = 20;
  const MARGIN_TABLET = 50;
  const GAP = 30;
  const MAX_WIDTH = 1200;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // console.log(width, window);

  switch (true) {  
    case (900 <= width && width < 1200):
      console.log('(900 <= width && width < 1200)');
      return {
        widthSelect: (width - 2 * MARGIN_TABLET - GAP) * 2 / 3,
        widthChart: (width - 2 * MARGIN_TABLET - GAP) * 1 / 3,
        widthTable: (width - 2 * MARGIN_TABLET - GAP) * 2 / 3
      };
    
    case (1200 <= width):
      console.log('(1200 <= width)');
      return {
        widthSelect: (MAX_WIDTH - GAP) * 2 / 3,
        widthChart: (MAX_WIDTH - GAP) * 1 / 3,
        widthTable: (MAX_WIDTH - GAP) * 2 / 3
      };

    default:
      console.log('MOBILE');

      console.log(width, {
        widthSelect: width - (MARGIN_MOBILE_LEFT + MARGIN_MOBILE_RIGHT),
        widthChart: width - (MARGIN_MOBILE_LEFT + MARGIN_MOBILE_RIGHT),
        widthTable: width - (MARGIN_MOBILE_LEFT + MARGIN_MOBILE_RIGHT),
      });
      return {
        widthSelect: width - (MARGIN_MOBILE_LEFT + MARGIN_MOBILE_RIGHT),
        widthChart: width - (MARGIN_MOBILE_LEFT + MARGIN_MOBILE_RIGHT),
        widthTable: width - (MARGIN_MOBILE_LEFT + MARGIN_MOBILE_RIGHT),
      };
  }
};
