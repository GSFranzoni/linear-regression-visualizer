export type Point = { x: number; y: number };

export type Line = { from: Point; to: Point };

export type Plot = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};
