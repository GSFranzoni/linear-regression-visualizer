import { useState } from "react";

import { Canvas, type Line, type Point } from "./components/canvas";

export function App() {
  const [points, setPoints] = useState<Point[]>([{ x: 0, y: 0 }]);

  const [lines, setLines] = useState<Line[]>([{ from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }]);

  return (
    <main className="flex h-svh w-svw items-center justify-center">
      <Canvas
        points={points}
        lines={lines}
        onClick={(point) => {
          setPoints((prev) => [...prev, point]);
        }}
      />
    </main>
  );
}
