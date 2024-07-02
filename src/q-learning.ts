import {
  DEFAULT_GOAL_POS,
  DEFAULT_OBSTACLE_POS,
  DEFAULT_START_POS,
  GRID_SIZE,
  OBSTACLE_SPEEDS,
} from "./constants";
import { State, Action, Reward } from "./types";
import Vec2 from "./vec2";

class QLearning {
  private QTable: Map<State, Map<Action, number>>;
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
    obstacle: Vec2,
  ) {
    this.QTable = new Map();
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
      return Object.values(Action)[Math.floor(Math.random() * 9)];
    }

    let bestAction = Action.UP;
    let bestValue = actions.get(bestAction) as number;
    actions.forEach((value, action) => {
      if (value > bestValue) {
        bestAction = action;
        bestValue = value;
      }
    });
    return bestAction;
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
    const newPos = this.obstaclePosition.add(new Vec2(rx, ry));
    if (
      newPos.x < 0 ||
      newPos.x >= GRID_SIZE.x ||
      newPos.y < 0 ||
      newPos.y >= GRID_SIZE.y
    ) {
      return state;
    }
    return { x: rx, y: ry };
  }

  private updateQValue(
    state: State,
    action: Action,
    reward: Reward,
    nextState: State,
  ): void {
    const qValue = this.getQValue(state, action);
    const nextAction = this.selectAction(nextState);
    const nextQValue = this.getQValue(nextState, nextAction);

    const newQValue =
      qValue + this.alpha * (reward + this.gamma * nextQValue - qValue);

    const actions = this.QTable.get(state);
    if (actions) {
      actions.set(action, newQValue);
    }
  }

  private getReward(state: State, action: Action): Reward {
    const rewarad = this.robotPosition.distanceTo(this.goalPosition);

    if (this.robotPosition.equals(this.goalPosition)) {

      if (this.steps < 10) {
        return Reward.GOAL * 5;
      }
        
      if (this.steps < 20) {
        return Reward.GOAL * 3;
      }

      if (this.steps < 50) {
        return Reward.GOAL * 2;
      }
      return Reward.GOAL;
    }

    if (this.robotPosition.equals(this.obstaclePosition)) {
      return Reward.OBSTACLE;
    }

    if (state.x > 0) {
      return Reward.RIGHT_SIDE;
    }

    return Reward.NOTHING - rewarad;
  }

  private getQValue(state: State, action: Action): number {
    const actions = this.QTable.get(state);

    if (!actions) {
      this.QTable.set(state, new Map<Action, number>([[action, 0]]));
      return 0;
    }

    if (!actions.has(action)) {
      actions.set(action, 0);
      return 0;
    }

    return actions.get(action) as number;
  }

  private updateRobotPosition(state: State): void {
    this.robotPosition = this.obstaclePosition.add(new Vec2(state.x, state.y));
  }

  private updateObstaclePosition(): void {
    const speed = OBSTACLE_SPEEDS[Math.floor(Math.random() * 3)];
    this.obstaclePosition = new Vec2(
      this.obstaclePosition.x,
      (this.obstaclePosition.y + speed) % GRID_SIZE.y,
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
      if  (this.robotPosition.equals(this.goalPosition)) {
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
    const reward = this.getReward(state, action);
    this.updateQValue(state, action, reward, nextState);
    this.updateRobotPosition(nextState);
    this.updateObstaclePosition();
    this.steps += 1;
  }
}

export default QLearning;
