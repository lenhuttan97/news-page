import { useState, useEffect, useRef } from 'react';

export function useLoadingTimer(loading, minTime = 150) {
  const [isShowing, setIsShowing] = useState(loading);
  const startTime = useRef(0);

  useEffect(() => {
    if (loading) {
      startTime.current = Date.now();
      setIsShowing(true);
    } else {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, minTime - elapsed);

      const timer = setTimeout(() => {
        setIsShowing(false);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [loading, minTime]);

  return isShowing;
}
