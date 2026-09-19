import { useCallback, useMemo, useState } from "react";
import { Group, Layer, Stage } from "react-konva";

import { CanvasGrid } from "@/components/canvas/canvas-grid";
import { createScales, getPlot, TICK_COUNT } from "@/components/canvas/plot";
import { PlotPoint } from "@/components/canvas/plot-point";
import { RegressionLine } from "@/components/canvas/regression-line";
import { ResidualLines } from "@/components/canvas/residual-lines";
import type { Line, Point } from "@/components/canvas/types";
import { useCanvasSize } from "@/hooks/use-canvas-size";

export type { Line, Point } from "./types";

type Props = {
  points: Point[];
  lines: Line[];
  onClick: (point: Point) => unknown;
  onPointChange?: (index: number, point: Point) => unknown;
  disabled?: boolean;
};

const getCssVariable = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const colors = {
  background: getCssVariable("--background"),
  border: getCssVariable("--border"),
  mutedForeground: getCssVariable("--muted-foreground"),
  destructive: getCssVariable("--destructive"),
  regressionLine: getCssVariable("--regression-line"),
  dataPoint: getCssVariable("--data-point"),
};

export const Canvas = ({ points, lines, onClick, onPointChange, disabled = false }: Props) => {
  const { containerRef, size } = useCanvasSize();

  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const plot = useMemo(() => getPlot(size), [size]);

  const scales = useMemo(() => createScales(plot), [plot]);

  const ticks = useMemo(() => scales.x.ticks(TICK_COUNT), [scales]);

  const addPoint = useCallback(
    (position: Point | null) => {
      if (disabled) {
        return;
      }
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
    [disabled, onClick, plot, scales],
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
    <div ref={containerRef} className="w-full" aria-label="Linear regression plot">
      <Stage
        width={size}
        height={size}
        onClick={(event) => addPoint(event.target.getStage()?.getPointerPosition() ?? null)}
        onTap={(event) => addPoint(event.target.getStage()?.getPointerPosition() ?? null)}
      >
        <CanvasGrid size={size} plot={plot} scales={scales} ticks={ticks} colors={colors} />
        <Layer listening={false}>
          <Group x={plot.left} y={plot.top} clipWidth={plot.width} clipHeight={plot.height}>
            {lines.map((line, index) => (
              <Group key={index}>
                <ResidualLines
                  points={points}
                  line={line}
                  plot={plot}
                  scales={scales}
                  color={colors.regressionLine}
                />
                <RegressionLine
                  line={line}
                  plot={plot}
                  scales={scales}
                  color={colors.regressionLine}
                />
              </Group>
            ))}
          </Group>
        </Layer>
        <Layer>
          <Group x={plot.left} y={plot.top}>
            {points.map((point, index) => (
              <PlotPoint
                key={index}
                index={index}
                x={scales.x(point.x) - plot.left}
                y={scales.y(point.y) - plot.top}
                hovered={hoveredPoint === index}
                left={plot.left}
                top={plot.top}
                width={plot.width}
                height={plot.height}
                onHover={setHoveredPoint}
                onPointChange={disabled ? undefined : onPointChange}
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
