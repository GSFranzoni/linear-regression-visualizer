import { useEffect, useRef, useState } from "react";

const MAX_SIZE = 560;
const DEFAULT_SIZE = 500;

export const useCanvasSize = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState(DEFAULT_SIZE);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const resize = () => {
      setSize(Math.floor(Math.min(container.clientWidth, MAX_SIZE)));
    };

    resize();

    const observer = new ResizeObserver(resize);

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return { containerRef, size };
};
