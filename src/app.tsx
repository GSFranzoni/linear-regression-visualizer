import { useState } from "react";

import { useLinearRegression } from "@/hooks/use-linear-regression";

import { Canvas, type Point } from "./components/canvas";

export function App() {
  const [points, setPoints] = useState<Point[]>([]);

  const { tensors, line } = useLinearRegression({ learningRate: 0.01, points });

  return (
    <main className="flex h-svh w-svw flex-col items-center justify-center gap-4">
      <span>
        <b>Tensors Used: </b> {tensors}
      </span>
      <button onClick={() => setPoints([])}>Reset</button>
      <Canvas
        points={points}
        lines={line ? [line] : []}
        onClick={(point) => {
          setPoints((prev) => [...prev, point]);
        }}
      />
    </main>
  );
}
