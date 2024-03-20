const V = 100

export class MainScene extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

    private actor!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private currentVelocity: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }

    constructor() {
        super('main')
    }

    preload() {
        this.load.image('penta', 'assets/img.png');
    }

    create() {
        this.actor = this.physics.add.sprite(100, 100, 'penta')
        this.actor.setDrag(300)

        this.cursors = this.input.keyboard?.createCursorKeys()

        this.input.addPointer(9)
        this.input.on('pointerdown', () => {
            this.input.mouse?.requestPointerLock()
        }, this)

        this.input.on('pointerup', () => {
            this.input.mouse?.releasePointerLock()
            this.changeVelocity({ x: 0, y: 0 })
        }, this)

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.input.mouse?.locked) {
                const xx = Math.abs(pointer.movementX)
                const yy = Math.abs(pointer.movementY)
                if (yy > xx) {
                    this.changeVelocity({ x: 0, y: Math.sign(pointer.movementY) * V })
                } else {
                    this.changeVelocity({ x: Math.sign(pointer.movementX) * V, y: 0 })
                }
            }
        }, this)

        this.input.keyboard?.on('keyup', () => {
            this.changeVelocity({ x: 0, y: 0 })
        }, this)
    }

    update() {
        if (this.currentVelocity.x !== 0 || this.currentVelocity.y !== 0) {
            this.actor.body.setVelocity(this.currentVelocity.x, this.currentVelocity.y)
        }

        if (this.cursors?.down.isDown) {
            this.changeVelocity({ x: 0, y: V })
        }
        if (this.cursors?.up.isDown) {
            this.changeVelocity({ x: 0, y: -V })
        }
        if (this.cursors?.right.isDown) {
            this.changeVelocity({ x: V, y: 0 })
        }
        if (this.cursors?.left.isDown) {
            this.changeVelocity({ x: -V, y: 0 })
        }
    }

    changeVelocity(v: Phaser.Types.Math.Vector2Like) {
        this.currentVelocity = v
    }
}
