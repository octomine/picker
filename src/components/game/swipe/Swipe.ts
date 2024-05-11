import { Directions, TMoveParams, TSwipeListeners } from "./Swipe.types"

class Swipe {
  private scene: Phaser.Scene

  private listeners!: TSwipeListeners
  private downPoint = new Phaser.Math.Vector2()
  private downTime = 0

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.setupEvents()
  }

  addListeners(listeners: TSwipeListeners) {
    this.listeners = listeners
  }

  private setupEvents() {
    this.scene.input.addListener(Phaser.Input.Events.POINTER_DOWN, this.downHandler, this)
    this.scene.input.addListener(Phaser.Input.Events.POINTER_UP, this.upHandler, this)
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.input.removeListener(Phaser.Input.Events.POINTER_DOWN, this.downHandler, this)
      this.scene.input.removeListener(Phaser.Input.Events.POINTER_MOVE, this.moveHandler, this)
      this.scene.input.removeListener(Phaser.Input.Events.POINTER_UP, this.upHandler, this)
    })
  }

  private downHandler(pointer: Phaser.Input.Pointer) {
    this.downPoint = pointer.position.clone()
    this.downTime = new Date().getTime()
    this.scene.input.addListener(Phaser.Input.Events.POINTER_MOVE, this.moveHandler, this)
  }

  private moveHandler(pointer: Phaser.Input.Pointer) {
    const movePrams = this.getMoveParams(this.downPoint, pointer.position, this.downTime)
    if (this.listeners?.onMove) {
      this.listeners.onMove(movePrams)
    }
  }

  private upHandler(pointer: Phaser.Input.Pointer) {
    this.scene.input.removeListener(Phaser.Input.Events.POINTER_MOVE, this.moveHandler, this)
    const movePrams = this.getMoveParams(this.downPoint, pointer.position, this.downTime)
    if (this.listeners?.onUp) {
      this.listeners.onUp(movePrams)
    }
  }

  private getMoveParams(startPoint: Phaser.Math.Vector2, endPoint: Phaser.Math.Vector2, startTime: number): TMoveParams {
    let direction = Directions.None
    const distance = startPoint.distance(endPoint)
    if (distance === 0) {
      direction = Directions.None
    } else {
      const rad = Phaser.Math.Angle.BetweenPoints(endPoint, startPoint)
      const deg = Phaser.Math.RadToDeg(rad)
      const abs = Math.abs(deg)
      if (abs < 45) {
        direction = Directions.Left
      } else if (abs > 135) {
        direction = Directions.Right
      } else if (deg > 0) {
        direction = Directions.Up
      } else {
        direction = Directions.Down
      }
    }
    const time = new Date().getTime() - startTime
    return { direction, distance, time }
  }
}

export default Swipe
