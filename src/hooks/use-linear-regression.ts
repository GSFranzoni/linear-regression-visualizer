import type { Scalar, Tensor1D } from "@tensorflow/tfjs";
import { useEffect, useEffectEvent, useState } from "react";

import type { Line, Point } from "@/components/canvas";
import { tf } from "@/lib/tf";

type Props = {
  learningRate: number;
  points: Point[];
};

type State = {
  line: Line | null;
  weightValue: number;
  biasValue: number;
  lossValue: number;
  iteration: number;
  numTensors: number;
};

const DEFAULT_STATE: State = {
  line: null,
  weightValue: 0,
  biasValue: 0,
  lossValue: 0,
  iteration: 0,
  numTensors: 0,
};

const MAX_ITERATIONS = Infinity;

const MINIMUM_POINTS = 2;

export const useLinearRegression = ({ learningRate, points }: Props) => {
  const [bias] = useState(() => tf.scalar(Math.random()).variable());

  const [weight] = useState(() => tf.scalar(Math.random()).variable());

  const [state, setState] = useState<State>(DEFAULT_STATE);

  const predict = (xs: Tensor1D): Tensor1D => xs.mul(weight).add(bias);

  const loss = (predictions: Tensor1D, labels: Tensor1D): Scalar =>
    predictions.sub(labels).square().mean();

  const train = useEffectEvent(async (optimizer: tf.Optimizer, signal: AbortSignal) => {
    if (points.length < MINIMUM_POINTS) {
      setState(DEFAULT_STATE);
      return;
    }

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
      if (signal.aborted) {
        return;
      }

      const { y1, y2, lossValue, weightValue, biasValue } = tf.tidy(() => {
        const xs = tf.tensor1d(points.map(({ x }) => x));

        const ys = tf.tensor1d(points.map(({ y }) => y));

        const [lossValue] = optimizer.minimize(() => loss(predict(xs), ys), true)?.dataSync() ?? [];

        const [y1, y2] = predict(tf.tensor1d([0, 1])).dataSync();

        const [weightValue] = weight.dataSync();

        const [biasValue] = bias.dataSync();

        return { y1, y2, lossValue, weightValue, biasValue };
      });

      setState((prev) => ({
        line: {
          from: { x: 0, y: y1 },
          to: { x: 1, y: y2 },
        },
        iteration: prev.iteration + 1,
        lossValue,
        weightValue,
        biasValue,
        numTensors: tf.memory().numTensors,
      }));

      await tf.nextFrame();
    }
  });

  useEffect(() => {
    const controller = new AbortController();

    const optimizer = tf.train.sgd(learningRate);

    // oxlint-disable-next-line react/set-state-in-effect
    void train(optimizer, controller.signal);

    return () => {
      controller.abort();
      optimizer.dispose();
    };
  }, [learningRate, points]);

  return state;
};
