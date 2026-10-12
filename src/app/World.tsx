import { useEffect, useState, type ReactNode } from 'react';
import { LAYOUT, worldScale } from '../config/layout.config';
export function World({ children }: { children: ReactNode }) {
  const [size, setSize] = useState(() => ({ w: innerWidth, h: innerHeight }));
  useEffect(() => {
    const resize = () => setSize({ w: innerWidth, h: innerHeight });
    addEventListener('resize', resize);
    return () => removeEventListener('resize', resize);
  }, []);
  const scale = worldScale(size.w, size.h);
  return (
    <main
      id="main"
      className="world-frame"
      style={{ width: LAYOUT.width * scale, height: LAYOUT.height * scale }}
    >
      <div className="world" data-scale={scale} style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </main>
  );
}
