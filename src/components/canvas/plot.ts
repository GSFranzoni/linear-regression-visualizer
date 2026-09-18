import { d3 } from "@/lib/d3";

import type { Plot } from "./types";

export const TICK_COUNT = 5;

export const getPlot = (size: number): Plot => {
  const left = Math.max(42, size * 0.1);
  const right = size - Math.max(18, size * 0.04);
  const top = Math.max(18, size * 0.04);
  const bottom = size - Math.max(38, size * 0.085);

  return { left, right, top, bottom, width: right - left, height: bottom - top };
};

export const createScales = (plot: Plot) => ({
  x: d3.scaleLinear().domain([0, 1]).range([plot.left, plot.right]),
  y: d3.scaleLinear().domain([0, 1]).range([plot.bottom, plot.top]),
});

export type CanvasScales = ReturnType<typeof createScales>;

export const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);
