import { MIN_DIST } from "../constants";
import { Player } from "../entities";

export class MainScene extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

    private actor!: Player
    private direction: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
    private pressedPoint!: Phaser.Types.Math.Vector2Like
    private isDragging = false;

    private score!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    private debText!: Phaser.GameObjects.Text

    constructor() {
        super('main')
    }

    preload() {
        this.load.image('penta', 'assets/img.png');
        this.load.image('score', 'assets/score.png');
        this.load.image('penalty', 'assets/penalty.png');
    }

    create() {
        this.actor = new Player(this, 100, 100)

        this.placeScore()

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
            this.direction = { x: 0, y: 0 }
            this.actor.setVelocity(this.direction)
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
                        this.direction = { x: 0, y: Math.sign(dy) }
                    } else {
                        this.direction = { x: Math.sign(dx), y: 0 }
                    }
                    this.actor.setVelocity(this.direction)
                } else {
                    this.pressedPoint = { x, y }
                }
            }
        }, this)

        this.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, () => {
            this.direction = { x: 0, y: 0 }
            this.actor.setVelocity(this.direction)
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
        if (this.direction.x !== 0 || this.direction.y !== 0) {
            this.actor.setVelocity(this.direction)
        }

        if (this.cursors?.down.isDown) {
            this.actor.setVelocity({ x: 0, y: 1 })
        }
        if (this.cursors?.up.isDown) {
            this.actor.setVelocity({ x: 0, y: -1 })
        }
        if (this.cursors?.right.isDown) {
            this.actor.setVelocity({ x: 1, y: 0 })
        }
        if (this.cursors?.left.isDown) {
            this.actor.setVelocity({ x: -1, y: 0 })
        }

        if (this.physics.overlap(this.actor, this.score)) {
            this.placeScore()
        }
    }

    placeScore() {
        const x = Phaser.Math.Between(0, this.scale.width)
        const y = Phaser.Math.Between(0, this.scale.height)
        if (!this.score) {
            this.score = this.physics.add.sprite(x, y, 'score')
        } else {
            this.score.setPosition(x, y)
        }
    }
}
