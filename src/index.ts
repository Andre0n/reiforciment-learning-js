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

let isTraining = false;

let stepsPerEpisode: number[] = [];

function visualizeTrain() {
  drawBoard(robot, goal, obstacle);
  let episode = 0;
  const maxEpisode = 1000;
  const run = () => {
    if (episode >= maxEpisode) {
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
      qLearning.obstaclePosition,
    );
    window.requestAnimationFrame(run);
  };
  window.requestAnimationFrame(run);
}

function train() {
  let episode = 0;
  const maxEpisode = 10000;
  while (episode < maxEpisode) {
    if (qLearning.endState()) {
      episode++;
      if (qLearning.success) stepsPerEpisode.push(qLearning.steps);
      qLearning.reset();
    }
    qLearning.trainOneEpisode();
  }
  drawChart();
}

function drawChart() {
  new Chart(ctx, {
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

document.getElementById("train")?.addEventListener("click", () => {
  isTraining = true;
  train();
});

document.getElementById("visualize-train")?.addEventListener("click", () => {
  isTraining = true;
  visualizeTrain();
});
