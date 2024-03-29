import { BASE_DRAG, BASE_VELOCITY, MIN_VELOCITY } from "../constants"

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player', 10)

        this.scene = scene
        this.scene.add.existing(this)
        this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)

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

    get cBody() {
        return this.body as Phaser.Physics.Arcade.Body
    }

    get currentVelocity() {
        return BASE_VELOCITY
    }
}

export default Player
