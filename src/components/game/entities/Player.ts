import { BASE_DRAG, BASE_VELOCITY } from "../constants"
import { TPlayerVelocity } from "./Player.types"

class Player extends Phaser.GameObjects.Sprite {
    private currentVelocity = BASE_VELOCITY

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'penta')

        this.scene = scene
        this.scene.add.existing(this)
        this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)

        this.cBody.setDrag(BASE_DRAG)
    }

    setVelocity({ x, y }: TPlayerVelocity) {
        this.cBody.setVelocity(x * this.currentVelocity, y * this.currentVelocity)
    }

    get cBody() {
        return this.body as Phaser.Physics.Arcade.Body
    }
}

export default Player
