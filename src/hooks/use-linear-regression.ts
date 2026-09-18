import type { Scalar, Tensor1D } from "@tensorflow/tfjs";
import { useEffect, useEffectEvent, useState } from "react";

import type { Line, Point } from "@/components/canvas";
import { tf } from "@/lib/tf";

const ITERATIONS = 100;

type Props = {
  learningRate: number;
  points: Point[];
};

export const useLinearRegression = ({ learningRate, points }: Props) => {
  const [optimizer] = useState(() => tf.train.sgd(learningRate));

  const [b] = useState(() => tf.scalar(Math.random()).variable());

  const [w] = useState(() => tf.scalar(Math.random()).variable());

  const [line, setLine] = useState<Line | null>(null);

  const predict = (xs: Tensor1D): Tensor1D => {
    return xs.mul(w).add(b);
  };

  const loss = (pred: Tensor1D, label: Tensor1D): Scalar => {
    return pred.sub(label).square().mean();
  };

  const train = useEffectEvent(async (signal: AbortSignal) => {
    if (points.length < 1) {
      setLine(null);
      return;
    }

    const xs = tf.tensor1d(points.map(({ x }) => x));

    const ys = tf.tensor1d(points.map(({ y }) => y));

    try {
      for (let i = 0; i < ITERATIONS; i++) {
        if (signal.aborted) {
          return;
        }

        const [y1, y2] = tf.tidy(() => {
          optimizer.minimize(() => loss(predict(xs), ys));

          return predict(tf.tensor1d([0, 1])).dataSync();
        });

        setLine({
          from: { x: 0, y: y1 },
          to: { x: 1, y: y2 },
        });

        await new Promise(requestAnimationFrame);
      }
    } finally {
      xs.dispose();
      ys.dispose();
    }
  });

  useEffect(() => {
    const controller = new AbortController();

    train(controller.signal);

    return () => controller.abort();
  }, [points]);

  return {
    line,
    tensors: tf.memory().numTensors,
  };
};
