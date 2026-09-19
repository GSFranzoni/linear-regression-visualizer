import { useState } from "react";

import { Canvas, type Point } from "@/components/canvas";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useLinearRegression } from "@/hooks/use-linear-regression";

const formatValue = (value: number | null | undefined, digits = 4) =>
  value === null || value === undefined ? "—" : value.toFixed(digits);

export function App() {
  const [points, setPoints] = useState<Point[]>([]);

  const [learningRate, setLearningRate] = useState(0.05);

  const state = useLinearRegression({ learningRate, points });

  const addPoint = (point: Point) => {
    setPoints((previous) => [...previous, point]);
  };

  const updatePoint = (index: number, point: Point) => {
    setPoints((previous) =>
      previous.map((current, currentIndex) => (currentIndex === index ? point : current)),
    );
  };

  const reset = () => {
    setPoints([]);
  };

  return (
    <main className="bg-background min-h-svh px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-186">
        <header className="max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Linear Regression</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Add points to the plot and see how gradient descent fits a line through the data.
          </p>
        </header>
        <section className="mt-10 grid grid-cols-[minmax(0,35rem)_10rem] items-start justify-center gap-6 max-[30rem]:grid-cols-1">
          <figure className="min-w-0">
            <Canvas
              points={points}
              lines={state.line ? [state.line] : []}
              onClick={addPoint}
              onPointChange={updatePoint}
            />
            <p className="text-muted-foreground mt-3 w-full text-center text-xs">
              {"Click to add a point, or drag a point to move it."}
            </p>
          </figure>
          <aside className="w-full pt-1 max-[30rem]:pt-0">
            <div>
              <label
                htmlFor="learning-rate"
                className="flex items-baseline justify-between text-sm font-medium"
              >
                Learning rate
                <output className="text-muted-foreground font-mono text-xs font-normal tabular-nums">
                  {learningRate.toFixed(3)}
                </output>
              </label>
              <Slider
                id="learning-rate"
                className="mt-3"
                min={0.001}
                max={0.5}
                step={0.001}
                value={[learningRate]}
                onValueChange={(value) =>
                  setLearningRate(typeof value === "number" ? value : value[0])
                }
              />
            </div>
            <section aria-labelledby="debug-heading" className="mt-6">
              <h2 id="debug-heading" className="text-sm font-medium">
                Debug
              </h2>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">Iteration</dt>
                  <dd className="tabular-nums">{state.iteration}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">Loss</dt>
                  <dd className="tabular-nums">{formatValue(state.lossValue, 5)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd className="tabular-nums">{formatValue(state.weightValue)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">Bias</dt>
                  <dd className="tabular-nums">{formatValue(state.biasValue)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">Tensor count</dt>
                  <dd className="tabular-nums">{state.numTensors}</dd>
                </div>
              </dl>
            </section>
            <div className="mt-5">
              <Button size="sm" variant="outline" onClick={reset} disabled={points.length === 0}>
                Reset
              </Button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
