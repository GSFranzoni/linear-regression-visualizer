# Linear Regression Visualizer

> A small visual experiment in gradient descent: add points to a chart and watch a line learn to fit them.

[![Live demo](https://img.shields.io/badge/live%20demo-open-6d5dfc?logo=github)](https://gsfranzoni.github.io/linear-regression-visualizer/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Bun](https://img.shields.io/badge/Bun-000?logo=bun&logoColor=white)](https://bun.sh/)

[Live demo →](https://gsfranzoni.github.io/linear-regression-visualizer/)

Linear Regression Visualizer is an interactive browser playground for the simplest machine-learning model: a straight line. Click the chart to add data points, drag them to change the data, and see gradient descent update the line in real time.

The app trains entirely in the browser with [TensorFlow.js](https://www.tensorflow.org/js). The plot is rendered with [Konva](https://konvajs.org/) and [React Konva](https://github.com/konvajs/react-konva), while [D3 scales](https://d3js.org/d3-scale) map data coordinates to the canvas.

## How it works

```text
Drawn points
  (x₁, y₁), (x₂, y₂), …, (xₙ, yₙ)
        │
        ▼
Prediction: ŷ = w × x + b
        │
        ▼
Mean squared error: MSE = mean((ŷ − y)²)
        │
        ▼
Gradient descent updates w and b
        │
        ▼
Regression line rendered on the plot
```

`w` is the weight (slope) and `b` is the bias (intercept). On every animation frame, TensorFlow.js minimizes mean squared error with stochastic gradient descent and the plot redraws the updated prediction. Changing the learning rate restarts the optimizer with the selected step size.

## What you can explore

- Click inside the chart to add points in the normalized `0…1` coordinate space.
- Drag a point to see how one observation changes the fitted line.
- Adjust the learning rate to compare slow, stable learning with larger updates.
- Inspect the current iteration, loss, weight, bias, and TensorFlow.js tensor count.

## Support

If you enjoyed this small machine-learning experiment, you can support its creator here:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?logo=buymeacoffee&logoColor=000)](https://buymeacoffee.com/gsfranzoni)

<a href="https://buymeacoffee.com/gsfranzoni">
  <img src="public/assets/buymeacoffee.png" width="220" alt="Buy Me a Coffee QR code for gsfranzoni" />
</a>

## Quick start

Requires [Bun](https://bun.sh/).

```bash
bun install
bun run dev
```

Open the Vite URL printed in the terminal, usually [`http://localhost:5173`](http://localhost:5173).

To create and preview a production build locally:

```bash
bun run build
bun run preview
```

## Data and browser training

There is no dataset to download and no server-side training step. The points you place on the canvas are the training data, and the model runs locally in your browser.

The hook requires at least two points, then continuously optimizes the line until the points or learning rate change. Resetting the canvas removes the observations and clears the visualized result.

> [!NOTE]
> This is a learning tool, not a statistical analysis package. The plot uses normalized coordinates from `0` to `1`, and the training loop is intentionally visible so you can observe the optimization process.

## Commands

| Command           | Purpose                                   |
| ----------------- | ----------------------------------------- |
| `bun run dev`     | Start the Vite development server.        |
| `bun run build`   | Type-check and create a production build. |
| `bun run preview` | Preview the production build locally.     |
| `bun run lint`    | Lint the project with Oxlint.             |

## Project structure

```text
src
├── components/canvas
│   └── Interactive Konva plot, grid, draggable points, and regression line
├── components/ui
│   └── Reusable UI primitives
├── hooks
│   ├── use-canvas-size.ts
│   └── use-linear-regression.ts
├── lib
│   ├── d3.ts
│   └── tf.ts
├── app.tsx
└── main.tsx

public
└── Static icons and support assets
```

The regression loop lives in [`src/hooks/use-linear-regression.ts`](src/hooks/use-linear-regression.ts). The canvas coordinate system and its D3 scales are defined in [`src/components/canvas/plot.ts`](src/components/canvas/plot.ts).

## Deployment

The project includes a GitHub Pages workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The Vite base path is configured from the GitHub repository name during a GitHub Actions deployment, while local development continues to use `/`.

In the repository settings, set **Pages → Source** to **GitHub Actions**. Push to `main` to run the deployment workflow.
