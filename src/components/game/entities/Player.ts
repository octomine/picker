import { Entity } from "."
import { BASE_DRAG, BASE_VELOCITY, MIN_VELOCITY } from "../constants"

class Player extends Entity {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 10)

    this.cBody.setSize(60, 90)
    this.cBody.setDrag(BASE_DRAG)

    this.state = 0
    this.play('stay')
  }

  setVelocity({ x, y }: Phaser.Types.Math.Vector2Like) {
    this.cBody.setVelocity(x * this.currentVelocity, y * this.currentVelocity)

    if (x > 0) {
      if (this.state != 1) {
        this.state = 1
        this.play('walkRight')
      }
    }
    if (x < 0) {
      if (this.state != 2) {
        this.state = 2
        this.play('walkLeft')
      }
    }
    if (y > 0) {
      if (this.state != 3) {
        this.state = 3
        this.play('walkDown')
      }
    }
    if (y < 0) {
      if (this.state != 4) {
        this.state = 4
        this.play('walkUp')
      }
    }
  }

  checkVelocity() {
    if (this.cBody.velocity.length() < MIN_VELOCITY) {
      this.state = 0;
      this.play('stay')
    }
  }

  damage(onComplete: () => void) {
    this.cBody.setVelocity(0)
    this.play('stay')
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
}

export default Player
