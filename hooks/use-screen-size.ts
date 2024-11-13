import { useState, useEffect } from 'react';

interface UseScreenSizeOptions {
  mobileBreakpoint?: number;
  onMobileChange?: (isMobile: boolean) => void;
}

interface ScreenSize {
  isMobile: boolean;
  width: number;
  height: number;
}

const useScreenSize = (options: UseScreenSizeOptions = {}): ScreenSize => {
  const { 
    mobileBreakpoint = 768,
    onMobileChange 
  } = options;

  // Always initialize with defaults
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    isMobile: false,
    width: 0,
    height: 0
  });

  // Single useEffect for all window-related logic
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < mobileBreakpoint;

      setScreenSize(prevSize => {
        if (prevSize.width !== width || 
            prevSize.height !== height || 
            prevSize.isMobile !== isMobile) {
          
          if (onMobileChange && prevSize.isMobile !== isMobile) {
            onMobileChange(isMobile);
          }
          
          return { width, height, isMobile };
        }
        return prevSize;
      });
    };

    // Initial check
    updateScreenSize();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScreenSize, 100);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileBreakpoint, onMobileChange]);

  return screenSize;
};

// SSR-safe version
const useScreenSizeSSR = (options?: UseScreenSizeOptions): ScreenSize => {
  const [mounted, setMounted] = useState(false);
  const screenSize = useScreenSize(options);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return default values until mounted
  if (!mounted) {
    return {
      isMobile: false,
      width: 0,
      height: 0
    };
  }

  return screenSize;
};

export default useScreenSize;