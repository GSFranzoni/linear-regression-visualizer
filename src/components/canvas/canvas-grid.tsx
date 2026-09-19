import { Arrow, Group, Line as KonvaLine, Layer, Rect, Text } from "react-konva";

import type { CanvasScales } from "./plot";
import type { Plot } from "./types";

const AXIS_EXTENSION = 8;

type Props = {
  size: number;
  plot: Plot;
  scales: CanvasScales;
  ticks: number[];
  colors: { background: string; border: string; mutedForeground: string; destructive: string };
};

export const CanvasGrid = ({ size, plot, scales, ticks, colors }: Props) => (
  <Layer listening={false}>
    <Rect width={size} height={size} fill={colors.background} />
    <Rect
      x={plot.left}
      y={plot.top}
      width={plot.width}
      height={plot.height}
      stroke={colors.border}
    />
    {ticks.map((tick) => (
      <Group key={tick}>
        <KonvaLine
          points={[scales.x(tick), plot.top, scales.x(tick), plot.bottom]}
          stroke={colors.border}
          opacity={0.75}
        />
        <KonvaLine
          points={[plot.left, scales.y(tick), plot.right, scales.y(tick)]}
          stroke={colors.border}
          opacity={0.75}
        />
        <Text
          x={scales.x(tick) - 14}
          y={plot.bottom + 12}
          width={28}
          align="center"
          text={tick.toFixed(1)}
          fill={colors.mutedForeground}
          fontSize={11}
        />
        <Text
          x={0}
          y={scales.y(tick) - 6}
          width={plot.left - 12}
          align="right"
          text={tick.toFixed(1)}
          fill={colors.mutedForeground}
          fontSize={11}
        />
      </Group>
    ))}
    <Arrow
      points={[plot.left - AXIS_EXTENSION, plot.bottom, plot.right + AXIS_EXTENSION, plot.bottom]}
      stroke={colors.mutedForeground}
      fill={colors.mutedForeground}
      pointerLength={8}
      pointerWidth={8}
    />
    <Arrow
      points={[plot.left, plot.bottom + AXIS_EXTENSION, plot.left, plot.top - AXIS_EXTENSION]}
      stroke={colors.mutedForeground}
      fill={colors.mutedForeground}
      pointerLength={8}
      pointerWidth={8}
    />
    <Text
      x={plot.left}
      y={size - 20}
      width={plot.width}
      align="center"
      text="x"
      fill={colors.mutedForeground}
      fontSize={12}
    />
    <Text
      x={12}
      y={plot.top + plot.height / 2 + 8}
      text="y"
      fill={colors.mutedForeground}
      fontSize={12}
      rotation={-90}
    />
  </Layer>
);
