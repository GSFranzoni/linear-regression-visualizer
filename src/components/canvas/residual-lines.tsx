import { useMemo } from "react";
import { Line as KonvaLine } from "react-konva";

import type { CanvasScales } from "@/components/canvas/plot";
import type { Line, Plot, Point } from "@/components/canvas/types";

type Props = {
  points: Point[];
  line: Line;
  plot: Plot;
  scales: CanvasScales;
  color: string;
};

export const ResidualLines = ({ points, line, plot, scales, color }: Props) => {
  const residuals = useMemo(() => {
    const slope = (line.to.y - line.from.y) / (line.to.x - line.from.x);

    return points.map((point) => {
      const fittedY = line.from.y + (point.x - line.from.x) * slope;
      const x = scales.x(point.x) - plot.left;

      return [x, scales.y(point.y) - plot.top, x, scales.y(fittedY) - plot.top];
    });
  }, [line.from.x, line.from.y, line.to.x, line.to.y, plot.left, plot.top, points, scales]);

  return residuals.map((residual, index) => (
    <KonvaLine
      key={index}
      points={residual}
      stroke={color}
      strokeWidth={1.5}
      dash={[5, 4]}
      opacity={0.55}
      listening={false}
      perfectDrawEnabled={false}
    />
  ));
};
