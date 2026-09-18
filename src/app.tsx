import { useState } from "react";

import { useLinearRegression } from "@/hooks/use-linear-regression";

import { Canvas, type Point } from "./components/canvas";

export function App() {
  const [points, setPoints] = useState<Point[]>([]);

  const { tensors, line } = useLinearRegression({ learningRate: 0.01, points });

  const addPoint = (point: Point) => {
    setPoints((previous) => [...previous, point]);
  };

  const updatePoint = (index: number, point: Point) => {
    setPoints((previous) =>
      previous.map((current, currentIndex) => (currentIndex === index ? point : current)),
    );
  };

  return (
    <main className="flex h-svh w-svw flex-col items-center justify-center gap-4">
      <span>
        <b>Tensors Used: </b> {tensors}
      </span>
      <button onClick={() => setPoints([])}>Reset</button>
      <Canvas
        points={points}
        lines={line ? [line] : []}
        onClick={addPoint}
        onPointChange={updatePoint}
      />
    </main>
  );
}
