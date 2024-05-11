export enum Directions {
  None = 0,
  Up,
  Right,
  Down,
  Left,
}

export type TMoveParams = {
  direction: Directions
  distance?: number
  time?: number
}

export type TSwipeListeners = {
  onMove?: (movePrams: TMoveParams) => void
  onUp?: (movePrams: TMoveParams) => void
}
