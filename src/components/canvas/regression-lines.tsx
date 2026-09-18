import { Group, Layer, Line as KonvaLine } from "react-konva";

import type { CanvasScales } from "./plot";
import type { Line, Plot } from "./types";

type Props = {
  lines: Line[];
  plot: Plot;
  scales: CanvasScales;
  color: string;
};

export const RegressionLines = ({ lines, plot, scales, color }: Props) => (
  <Layer listening={false}>
    <Group x={plot.left} y={plot.top} clipWidth={plot.width} clipHeight={plot.height}>
      {lines.map((line, index) => (
        <KonvaLine
          key={index}
          points={[
            scales.x(line.from.x) - plot.left,
            scales.y(line.from.y) - plot.top,
            scales.x(line.to.x) - plot.left,
            scales.y(line.to.y) - plot.top,
          ]}
          stroke={color}
          strokeWidth={2.5}
          lineCap="round"
          lineJoin="round"
          perfectDrawEnabled={false}
        />
      ))}
    </Group>
  </Layer>
);
