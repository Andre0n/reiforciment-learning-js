export type State = { x: number; y: number };

export enum Action {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
  STAY,
}

export enum Reward {
  GOAL = 500,
  OBSTACLE = -10,
  RIGHT_SIDE = 5,
  NOTHING = -5,
}
