import { PlayerStates } from "."
import { Entity } from ".."
import { BASE_DRAG, BASE_VELOCITY, MIN_VELOCITY } from "../../constants"

class Player extends Entity {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 10)

    this.cBody.setSize(60, 90)
    this.cBody.setDrag(BASE_DRAG)
    this.cBody.setCollideWorldBounds(true)

    this.setState(PlayerStates.Stay)
  }

  setVelocity({ x, y }: Phaser.Types.Math.Vector2Like) {
    this.cBody.setVelocity(x * this.currentVelocity, y * this.currentVelocity)

    if (x > 0) {
      if (this.state != PlayerStates.WalkRight) {
        this.setState(PlayerStates.WalkRight)
      }
    }
    if (x < 0) {
      if (this.state != PlayerStates.WalkLeft) {
        this.setState(PlayerStates.WalkLeft)
      }
    }
    if (y > 0) {
      if (this.state != PlayerStates.WalkDown) {
        this.setState(PlayerStates.WalkDown)
      }
    }
    if (y < 0) {
      if (this.state != PlayerStates.WalkDown) {
        this.setState(PlayerStates.WalkDown)
      }
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
