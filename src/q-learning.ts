import {
  DEFAULT_GOAL_POS,
  DEFAULT_OBSTACLE_POS,
  DEFAULT_START_POS,
  GRID_SIZE,
  OBSTACLE_SPEEDS,
} from "./constants";
import { State, Action, Reward } from "./types";
import Vec2 from "./vec2";
import MMap from "./MMap";

class QLearning {
  public QTable: MMap<State, number[]>;
  private alpha: number;
  private gamma: number;
  private epsilon: number;

  public robotPosition: Vec2;
  public goalPosition: Vec2;
  public obstaclePosition: Vec2;

  public steps: number = 0;
  public success: boolean = false;

  constructor(
    alpha: number,
    gamma: number,
    epsilon: number,
    robot: Vec2,
    goal: Vec2,
    obstacle: Vec2
  ) {
    this.QTable = new MMap();
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;

    this.robotPosition = robot;
    this.goalPosition = goal;
    this.obstaclePosition = obstacle;
  }

  private selectAction(state: State): Action {
    const randomValue = Math.random();
    const actions = this.QTable.get(state);

    if (!actions || randomValue < this.epsilon) {
      return Math.floor(Math.random() * 9);
    }

    let bestAction = actions.reduce(
      (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
      0
    );
    return bestAction;
  }

  private selectBestAction(state: State): Action {
    const actions = this.QTable.get(state);
    if (actions) {
      let bestAction = actions.reduce(
        (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
        0
      );
      return bestAction;
    }
    return Action.RIGHT;
  }

  private performAction(state: State, action: Action): State {
    let rx = state.x;
    let ry = state.y;
    switch (action) {
      case Action.UP:
        ry -= 1;
        break;
      case Action.DOWN:
        ry += 1;
        break;
      case Action.LEFT:
        rx -= 1;
        break;
      case Action.RIGHT:
        rx += 1;
        break;
      case Action.UP_LEFT:
        rx -= 1;
        ry -= 1;
        break;
      case Action.UP_RIGHT:
        rx += 1;
        ry -= 1;
        break;
      case Action.DOWN_LEFT:
        rx -= 1;
        ry += 1;
        break;
      case Action.DOWN_RIGHT:
        rx += 1;
        ry += 1;
        break;
    }
    if (
      this.obstaclePosition.x + rx < 0 ||
      this.obstaclePosition.x + rx >= GRID_SIZE.x
    ) {
      rx = state.x;
    }
    if (
      this.obstaclePosition.y + ry < 0 ||
      this.obstaclePosition.y + ry >= GRID_SIZE.y
    ) {
      ry = state.y;
    }

    return { x: rx, y: ry };
  }

  private updateQValue(
    state: State,
    action: Action,
    reward: Reward,
    nextState: State
  ): void {
    const qValue = this.getQValue(state, action);
    const nextAction = this.selectAction(nextState);
    const nextQValue = this.getQValue(nextState, nextAction);

    const newQValue =
      qValue + this.alpha * (reward + this.gamma * nextQValue - qValue);

    const actions = this.QTable.get(state);
    if (actions) {
      actions[action] = newQValue;
    }
  }

  private getReward(state: State): Reward {
    if (this.robotPosition.equals(this.goalPosition)) {
      return Reward.GOAL;
    }

    if (this.robotPosition.equals(this.obstaclePosition)) {
      return Reward.OBSTACLE;
    }

    if (state.x > 0) {
      return Reward.RIGHT_SIDE;
    }
    return Reward.NOTHING;
  }

  private getQValue(state: State, action: Action): number {
    const actions = this.QTable.get(state);

    if (!actions) {
      this.QTable.set(state, Array(9).fill(0));
      return 0;
    }

    return actions[action];
  }

  private updateRobotPosition(state: State): void {
    this.robotPosition = this.obstaclePosition.add(state as Vec2);
  }

  private updateObstaclePosition(): void {
    const speed = OBSTACLE_SPEEDS[Math.floor(Math.random() * 3)];
    this.obstaclePosition = new Vec2(
      this.obstaclePosition.x,
      (this.obstaclePosition.y + speed) % GRID_SIZE.y
    );
  }

  reset(): void {
    this.robotPosition = DEFAULT_START_POS;
    this.goalPosition = DEFAULT_GOAL_POS;
    this.obstaclePosition = DEFAULT_OBSTACLE_POS;
    this.steps = 0;
    this.success = false;
  }

  endState(): boolean {
    if (
      this.robotPosition.equals(this.goalPosition) ||
      this.robotPosition.equals(this.obstaclePosition)
    ) {
      if (this.robotPosition.equals(this.goalPosition)) {
        this.success = true;
      }
      return true;
    }
    return false;
  }

  trainOneEpisode(): void {
    let relativePos = this.robotPosition.sub(this.obstaclePosition);
    let state = { ...relativePos };
    const action = this.selectAction(state);
    const nextState = this.performAction(state, action);
    const reward = this.getReward(state);
    this.updateQValue(state, action, reward, nextState);
    this.updateRobotPosition(nextState);
    this.updateObstaclePosition();
    this.steps += 1;
  }

  testOneEpisode(): void {
    let relativePos = this.robotPosition.sub(this.obstaclePosition);
    let state = { ...relativePos };
    const action = this.selectBestAction(state);
    const nextState = this.performAction(state, action);
    this.updateRobotPosition(nextState);
    this.updateObstaclePosition();
    this.steps += 1;
  }
}

export default QLearning;
