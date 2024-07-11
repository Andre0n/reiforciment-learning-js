import {
  DEFAULT_GOAL_POS,
  DEFAULT_OBSTACLE_POS,
  DEFAULT_START_POS,
} from "./constants";
import QLearning from "./q-learning";
import { drawBoard } from "./draw";

import Chart from "chart.js/auto";

const canvas = document.getElementById("chart") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = 700;
canvas.height = 300;

const robot = DEFAULT_START_POS;
const obstacle = DEFAULT_OBSTACLE_POS;
const goal = DEFAULT_GOAL_POS;

const qLearning = new QLearning(0.5, 0.9, 0.1, robot, goal, obstacle);

let chart: Chart<"line", number[], number> | null = null;
let modelReady = false;
let stepsPerEpisode: number[] = [];

function visualizeTrain() {
  drawBoard(robot, goal, obstacle);
  let episode = 0;
  const maxEpisode = 1000;
  const run = () => {
    if (episode >= maxEpisode) {
      modelReady = true;
      return;
    }
    if (qLearning.endState()) {
      episode++;
      if (qLearning.success) stepsPerEpisode.push(qLearning.steps);
      qLearning.reset();
    }
    qLearning.trainOneEpisode();
    drawBoard(
      qLearning.robotPosition,
      qLearning.goalPosition,
      qLearning.obstaclePosition
    );
    window.requestAnimationFrame(run);
  };
  window.requestAnimationFrame(run);
}

function train() {
  let episode = 0;
  const maxEpisode = 100_000;
  while (episode < maxEpisode) {
    if (qLearning.endState()) {
      episode++;
      if (qLearning.success) stepsPerEpisode.push(qLearning.steps);
      qLearning.reset();
    }
    qLearning.trainOneEpisode();
  }
  drawChart();
  modelReady = true;
}

function drawChart() {
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: stepsPerEpisode.map((_, i) => i),
      datasets: [
        {
          label: "Steps per episode",
          data: stepsPerEpisode,
          borderColor: "blue",
          fill: false,
        },
      ],
    },
  });
}

function visulaizeTest() {
  if (!modelReady) {
    alert("Model is not ready! Click at train button.");
    return;
  }
  qLearning.reset();
  drawBoard(robot, goal, obstacle);
  let episode = 0;
  const maxEpisode = 50;
  const run = () => {
    if (episode >= maxEpisode) {
      return;
    }
    if (qLearning.endState()) {
      episode++;
      if (qLearning.success) stepsPerEpisode.push(qLearning.steps);
      qLearning.reset();
    }
    qLearning.testOneEpisode();
    drawBoard(
      qLearning.robotPosition,
      qLearning.goalPosition,
      qLearning.obstaclePosition
    );
    window.requestAnimationFrame(run);
  };
  window.requestAnimationFrame(run);

  drawChart();
}

document.getElementById("train")?.addEventListener("click", () => {
  train();
});

document.getElementById("visualize-train")?.addEventListener("click", () => {
  visualizeTrain();
});

document.getElementById("test")?.addEventListener("click", () => {
  visulaizeTest();
});
