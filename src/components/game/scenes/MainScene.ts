import { BASE_DRAG, MIN_DIST, BASE_VELOCITY } from "../constants";

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
        this.actor.setDrag(BASE_DRAG)

        this.cursors = this.input.keyboard?.createCursorKeys()

        this.input.addPointer(9)
        this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
            this.debText.setText('DOWN')
            this.isDragging = true
            const { x, y } = pointer
            this.pressedPoint = { x, y }
        }, this)

        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.debText.setText('UP')
            this.isDragging = false
            this.changeVelocity({ x: 0, y: 0 })
        }, this)

        this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
            if (this.isDragging) {
                const { position, prevPosition, x, y } = pointer
                const dist = position.distance(prevPosition)
                if (dist > MIN_DIST) {
                    this.debText.setText('MOVE')
                    const dx = x - this.pressedPoint.x
                    const dy = y - this.pressedPoint.y
                    const xx = Math.abs(dx)
                    const yy = Math.abs(dy)
                    if (yy > xx) {
                        this.changeVelocity({ x: 0, y: Math.sign(dy) * BASE_VELOCITY })
                    } else {
                        this.changeVelocity({ x: Math.sign(dx) * BASE_VELOCITY, y: 0 })
                    }
                } else {
                    this.pressedPoint = { x, y }
                }
            }
        }, this)

        this.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, () => {
            this.changeVelocity({ x: 0, y: 0 })
        }, this)

        this.scale.addListener(Phaser.Scale.Events.RESIZE, ({ width, height }: { width: number, height: number }) => {
            console.log('RESIZE!!1');
            this.debText.setText([
                `width: ${width}`,
                `height: ${height}`
            ])
        }, this)

        this.debText = this.add.text(0, 0, 'deb', { fontSize: '20px', color: '#ffffff' })
    }

    update() {
        if (this.currentVelocity.x !== 0 || this.currentVelocity.y !== 0) {
            this.actor.body.setVelocity(this.currentVelocity.x, this.currentVelocity.y)
        }

        if (this.cursors?.down.isDown) {
            this.changeVelocity({ x: 0, y: BASE_VELOCITY })
        }
        if (this.cursors?.up.isDown) {
            this.changeVelocity({ x: 0, y: -BASE_VELOCITY })
        }
        if (this.cursors?.right.isDown) {
            this.changeVelocity({ x: BASE_VELOCITY, y: 0 })
        }
        if (this.cursors?.left.isDown) {
            this.changeVelocity({ x: -BASE_VELOCITY, y: 0 })
        }
    }

    changeVelocity(v: Phaser.Types.Math.Vector2Like) {
        this.currentVelocity = v
    }
}
