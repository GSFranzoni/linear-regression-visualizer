import { Circle, Layer, Line, Rect, Stage } from "react-konva";

import { d3 } from "@/lib/d3";

const CANVAS_SIZE = 500;

const PADDING = 0;

export type Point = {
  x: number;
  y: number;
};

export type Line = {
  from: Point;
  to: Point;
};

const getCssVariable = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const xScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([PADDING, CANVAS_SIZE - PADDING]);

const yScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([CANVAS_SIZE - PADDING, PADDING]);

type Props = {
  points: Point[];
  lines: Line[];
  onClick: (point: Point) => unknown;
};

export const Canvas = ({ points, lines, onClick }: Props) => {
  return (
    <Stage width={CANVAS_SIZE} height={CANVAS_SIZE}>
      <Layer
        onClick={(event) => {
          onClick({
            x: xScale.invert(event.evt.offsetX),
            y: yScale.invert(event.evt.offsetY),
          });
        }}
      >
        <Rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill={getCssVariable("--background")} />
        {points.map(({ x, y }, index) => (
          <Circle
            key={index}
            x={xScale(x)}
            y={yScale(y)}
            radius={3}
            fill={getCssVariable("--foreground")}
          />
        ))}
        {lines.map((line, index) => (
          <Line
            key={index}
            points={[
              xScale(line.from.x),
              yScale(line.from.y),
              xScale(line.to.x),
              yScale(line.to.y),
            ]}
            stroke={getCssVariable("--foreground")}
            strokeWidth={2}
          />
        ))}
      </Layer>
    </Stage>
  );
};
