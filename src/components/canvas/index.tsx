import { useCallback, useMemo, useState } from "react";
import { Group, Layer, Stage } from "react-konva";

import { useCanvasSize } from "@/hooks/use-canvas-size";

import { CanvasGrid } from "./canvas-grid";
import { createScales, getPlot, TICK_COUNT } from "./plot";
import { PlotPoint } from "./plot-point";
import { RegressionLines } from "./regression-lines";
import type { Line, Point } from "./types";

export type { Line, Point } from "./types";

type Props = {
  points: Point[];
  lines: Line[];
  onClick: (point: Point) => unknown;
  onPointChange?: (index: number, point: Point) => unknown;
};

const getCssVariable = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const colors = {
  background: getCssVariable("--background"),
  border: getCssVariable("--border"),
  mutedForeground: getCssVariable("--muted-foreground"),
  regressionLine: getCssVariable("--regression-line"),
  dataPoint: getCssVariable("--data-point"),
};

export const Canvas = ({ points, lines, onClick, onPointChange }: Props) => {
  const { containerRef, size } = useCanvasSize();

  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const plot = useMemo(() => getPlot(size), [size]);

  const scales = useMemo(() => createScales(plot), [plot]);

  const ticks = useMemo(() => scales.x.ticks(TICK_COUNT), [scales]);

  const addPoint = useCallback(
    (position: Point | null) => {
      if (
        !position ||
        position.x < plot.left ||
        position.x > plot.right ||
        position.y < plot.top ||
        position.y > plot.bottom
      ) {
        return;
      }

      onClick({ x: scales.x.invert(position.x), y: scales.y.invert(position.y) });
    },
    [onClick, plot, scales],
  );

  const invertX = useCallback(
    (value: number) => scales.x.invert(value + plot.left),
    [plot.left, scales],
  );

  const invertY = useCallback(
    (value: number) => scales.y.invert(value + plot.top),
    [plot.top, scales],
  );

  return (
    <div ref={containerRef} aria-label="Linear regression plot">
      <Stage
        width={size}
        height={size}
        onClick={(event) => addPoint(event.target.getStage()?.getPointerPosition() ?? null)}
        onTap={(event) => addPoint(event.target.getStage()?.getPointerPosition() ?? null)}
      >
        <CanvasGrid size={size} plot={plot} scales={scales} ticks={ticks} colors={colors} />
        <RegressionLines lines={lines} plot={plot} scales={scales} color={colors.regressionLine} />
        <Layer>
          <Group x={plot.left} y={plot.top}>
            {points.map((point, index) => (
              <PlotPoint
                key={`${point.x}-${point.y}-${index}`}
                index={index}
                x={scales.x(point.x) - plot.left}
                y={scales.y(point.y) - plot.top}
                hovered={hoveredPoint === index}
                width={plot.width}
                height={plot.height}
                onHover={setHoveredPoint}
                onPointChange={onPointChange}
                invertX={invertX}
                invertY={invertY}
                color={colors.dataPoint}
                strokeColor={colors.background}
              />
            ))}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};
