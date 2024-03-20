const V = 100

export class MainScene extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

    private actor!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private currentVelocity: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
    private pressedPoint!: Phaser.Types.Math.Vector2Like
    private isDragging = false;

    private debText!: Phaser.GameObjects.Text

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
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.debText.setText('DOWN')
            this.isDragging = true
            const { x, y } = pointer
            this.pressedPoint = { x, y }
        }, this)

        this.input.on('pointerup', () => {
            this.debText.setText('UP')
            this.isDragging = false
            this.changeVelocity({ x: 0, y: 0 })
        }, this)

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isDragging) {
                this.debText.setText('MOVE')
                const dx = pointer.x - this.pressedPoint.x
                const dy = pointer.y - this.pressedPoint.y
                const xx = Math.abs(dx)
                const yy = Math.abs(dy)
                if (yy > xx) {
                    this.changeVelocity({ x: 0, y: Math.sign(dy) * V })
                } else {
                    this.changeVelocity({ x: Math.sign(dx) * V, y: 0 })
                }
            }
        }, this)

        this.input.keyboard?.on('keyup', () => {
            this.changeVelocity({ x: 0, y: 0 })
        }, this)

        this.debText = this.add.text(0, 0, 'deb', { fontSize: '20px', color: '#ffffff' })
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
