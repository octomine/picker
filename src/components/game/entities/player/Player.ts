import { PlayerStates } from "."
import { Entity } from ".."
import { BASE_DRAG, BASE_VELOCITY, MIN_VELOCITY } from "../../constants"
import { Directions, TMoveParams } from "../../swipe"

class Player extends Entity {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 10)

    this.cBody.setSize(60, 90)
    this.cBody.setDrag(BASE_DRAG)
    this.cBody.setCollideWorldBounds(true)

    this.setState(PlayerStates.Stay)
  }

  walk({ direction }: TMoveParams) {
    switch (direction) {
      case Directions.None:
        this.setVelocity(0)
        break
      case Directions.Up:
        this.setVelocityY(-this.currentVelocity)
        break
      case Directions.Down:
        this.setVelocityY(this.currentVelocity)
        break
      case Directions.Left:
        this.setVelocityX(-this.currentVelocity)
        break
      case Directions.Right:
        this.setVelocityX(this.currentVelocity)
        break
      default:
    }
  }

  checkVelocity() {
    if (this.cBody.velocity.length() < MIN_VELOCITY) {
      this.setState(PlayerStates.Stay)
    }
  }

  damage(onComplete = () => { /*  */ }) {
    this.cBody.setVelocity(0)
    this.setState(PlayerStates.Stay)
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      alpha: .25,
      callbackScope: this.scene,
      onComplete,
    })
  }

  score() {
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      scale: 1.2,
      yoyo: true,
    })
  }

  get cBody() {
    return this.body as Phaser.Physics.Arcade.Body
  }

  get currentVelocity() {
    return BASE_VELOCITY
  }

  override setState(value: string | number): this {
    super.setState(value)
    this.play(PlayerStates[Number(value)])

    return this
  }
}

export default Player
