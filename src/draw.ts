import {
  CELL_COLOR,
  CELL_SIZE,
  GOAL_COLOR,
  GRID_SIZE,
  OBSTACLE_COLOR,
  ROBOT_COLOR,
} from "./constants";
import Vec2 from "./vec2";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = GRID_SIZE.x * CELL_SIZE;
canvas.height = GRID_SIZE.y * CELL_SIZE;

export function drawBoard(robotPos: Vec2, goalPos: Vec2, obstaclePos: Vec2) {
  for (let row = 0; row < GRID_SIZE.y; row++) {
    for (let col = 0; col < GRID_SIZE.x; col++) {
      let color = CELL_COLOR;
      let cellPos = new Vec2(col, row);
      if (robotPos.equals(cellPos)) {
        color = ROBOT_COLOR;
      } else if (goalPos.equals(cellPos)) {
        color = GOAL_COLOR;
      } else if (obstaclePos.equals(cellPos)) {
        color = OBSTACLE_COLOR;
      }

      ctx.fillStyle = "#fff";
      ctx.fillStyle = color;
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  ctx.strokeStyle = "#000";
  for (let row = 0; row <= GRID_SIZE.y; row++) {
    ctx.beginPath();
    ctx.moveTo(0, row * CELL_SIZE);
    ctx.lineTo(GRID_SIZE.x * CELL_SIZE, row * CELL_SIZE);
    ctx.stroke();
  }

  for (let col = 0; col <= GRID_SIZE.x; col++) {
    ctx.beginPath();
    ctx.moveTo(col * CELL_SIZE, 0);
    ctx.lineTo(col * CELL_SIZE, GRID_SIZE.y * CELL_SIZE);
    ctx.stroke();
  }
}
