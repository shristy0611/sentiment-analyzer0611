import { useState, useEffect } from 'react';

export const useResponsiveWidth = () => {
  const [width, setWidth] = useState('20vw');

  const calculateWidth = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) { // xs
      return '100vw';
    } else if (screenWidth < 640) { // sm
      return '90vw';
    } else if (screenWidth < 768) { // md
      return '60vw';
    } else if (screenWidth < 1024) { // lg
      return '40vw';
    } else if (screenWidth < 1280) { // xl
      return '30vw';
    } else { // 2xl
      return '25vw';
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      setWidth(calculateWidth());
    };

    // Initial width
    updateWidth();

    // Update width on resize with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateWidth, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return width;
};
