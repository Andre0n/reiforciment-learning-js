export type State = { x: number; y: number };

export enum Action {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
  UP_LEFT = "up-left",
  UP_RIGHT = "up-right",
  DOWN_LEFT = "down-left",
  DOWN_RIGHT = "down-right",
  STAY = "stay",
}

export enum Reward {
  GOAL = 50,
  RIGHT_SIDE = 30,
  OBSTACLE = -20,
  NOTHING = -1,
}
