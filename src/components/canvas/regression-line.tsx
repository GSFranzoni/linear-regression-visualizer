import Konva from "konva";
import { useEffect, useMemo, useRef, useState } from "react";
import { Line as KonvaLine } from "react-konva";

import type { CanvasScales } from "@/components/canvas/plot";
import type { Line, Plot } from "@/components/canvas/types";

type Props = {
  line: Line;
  plot: Plot;
  scales: CanvasScales;
  color: string;
};

const TRANSITION_DURATION = 0.12;

export const RegressionLine = ({ line, plot, scales, color }: Props) => {
  const nodeRef = useRef<Konva.Line>(null);

  const points = useMemo(
    () => [
      scales.x(line.from.x) - plot.left,
      scales.y(line.from.y) - plot.top,
      scales.x(line.to.x) - plot.left,
      scales.y(line.to.y) - plot.top,
    ],
    [line.from.x, line.from.y, line.to.x, line.to.y, plot.left, plot.top, scales],
  );

  const [initialPoints] = useState(points);

  useEffect(() => {
    const node = nodeRef.current;

    if (!node) {
      return;
    }

    const tween = new Konva.Tween({
      node,
      points,
      duration: TRANSITION_DURATION,
      easing: Konva.Easings.EaseOut,
    });

    tween.play();

    return () => tween.destroy();
  }, [points]);

  return (
    <KonvaLine
      ref={nodeRef}
      points={initialPoints}
      stroke={color}
      strokeWidth={2.5}
      lineCap="round"
      lineJoin="round"
      perfectDrawEnabled={false}
    />
  );
};
