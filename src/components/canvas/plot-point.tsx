import { memo } from "react";
import { Circle, Group } from "react-konva";

import { clamp } from "./plot";
import type { Point } from "./types";

type Props = {
  index: number;
  x: number;
  y: number;
  hovered: boolean;
  width: number;
  height: number;
  onHover: (index: number | null) => void;
  onPointChange?: (index: number, point: Point) => unknown;
  invertX: (value: number) => number;
  invertY: (value: number) => number;
  color: string;
  strokeColor: string;
};

export const PlotPoint = memo(function PlotPoint({
  index,
  x,
  y,
  hovered,
  width,
  height,
  onHover,
  onPointChange,
  invertX,
  invertY,
  color,
  strokeColor,
}: Props) {
  return (
    <Group
      x={x}
      y={y}
      draggable={Boolean(onPointChange)}
      dragBoundFunc={(position) => ({
        x: clamp(position.x, 0, width),
        y: clamp(position.y, 0, height),
      })}
      onClick={(event) => {
        event.cancelBubble = true;
      }}
      onTap={(event) => {
        event.cancelBubble = true;
      }}
      onMouseEnter={(event) => {
        event.target.getStage()?.container().style.setProperty("cursor", "grab");
        onHover(index);
      }}
      onMouseLeave={(event) => {
        event.target.getStage()?.container().style.setProperty("cursor", "crosshair");
        onHover(null);
      }}
      onDragStart={(event) => {
        event.cancelBubble = true;
        event.target.getStage()?.container().style.setProperty("cursor", "grabbing");
      }}
      onDragEnd={(event) => {
        event.cancelBubble = true;
        event.target.getStage()?.container().style.setProperty("cursor", "grab");
        const position = event.target.position();
        onPointChange?.(index, {
          x: clamp(invertX(position.x), 0, 1),
          y: clamp(invertY(position.y), 0, 1),
        });
      }}
    >
      <Circle radius={hovered ? 8 : 6} fill={color} opacity={hovered ? 0.16 : 0.1} />
      <Circle radius={hovered ? 4.5 : 4} fill={color} stroke={strokeColor} strokeWidth={1.5} />
    </Group>
  );
});
