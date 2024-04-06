import { DELAY, DELAY_STEP, MIN_DIST } from "../constants";
import { Player } from "../entities";
import { createAnimations } from "./";

export class MainScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

  private actor!: Player
  private direction: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
  private pressedPoint!: Phaser.Types.Math.Vector2Like
  private isDragging = false;

  private score!: Phaser.GameObjects.Group
  private penalty!: Phaser.GameObjects.Group
  private gameTimer!: Phaser.Time.TimerEvent

  private currentScore = 0
  private level = 1
  private rest = 3
  private collected = 0

  private coeffDelay = 1

  private debText!: Phaser.GameObjects.Text

  constructor() {
    super('main')
  }

  preload() {
    this.load.spritesheet('player', 'assets/char.png', { frameWidth: 70, frameHeight: 100 });
    this.load.image('score', 'assets/score.png');
    this.load.image('penalty', 'assets/penalty.png');
  }

  create() {
    createAnimations(this.anims)

    this.actor = new Player(this, 100, 100)

    this.score = this.add.group()
    this.penalty = this.add.group()
    this.gameTimer = this.time.delayedCall(DELAY, this.addObj, [], this)

    this.cursors = this.input.keyboard?.createCursorKeys()

    this.input.addPointer(9)
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      this.isDragging = true
      const { x, y } = pointer
      this.pressedPoint = { x, y }
    }, this)

    this.input.on(Phaser.Input.Events.POINTER_UP, () => {
      this.isDragging = false
      this.direction = { x: 0, y: 0 }
    }, this)

    this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        const { position, prevPosition, x, y } = pointer
        const dist = position.distance(prevPosition)
        if (dist > MIN_DIST) {
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
    }, this)

    this.scale.addListener(Phaser.Scale.Events.RESIZE, ({ width, height }: { width: number, height: number }) => {
      console.log('RESIZE!!1');
      this.debText.setText([
        `width: ${width}`,
        `height: ${height}`
      ])
    }, this)

    this.debText = this.add.text(0, 0, 'deb', { fontSize: '20px', color: '#ffffff' })

    this.resetGame()
  }

  update() {
    const { x, y } = this.direction
    if (x !== 0 || y !== 0) {
      this.actor.setVelocity(this.direction)
    }

    if (x === 0 && y === 0) {
      this.actor.checkVelocity()
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

    // *** COLLISIONS ***
    // score
    if (this.physics.overlap(this.actor, this.score, (actor, score) => {
      console.log(actor);
      this.coeffDelay = Math.max(this.coeffDelay - DELAY_STEP, .1)
      this.score.remove(score as Phaser.GameObjects.GameObject)
      score.destroy(true)

      this.currentScore += 10
      this.collected++
      if (this.collected >= 10) {
        this.resetGame()
        this.level++
      }
      this.updateInfo()
    })) {
      // this.debText.setText(`${DELAY * this.coeffDelay}`)
    }

    // penalty
    if (this.physics.overlap(this.actor, this.penalty)) {
      this.rest--
      if (this.rest <= 0) {
        this.rest = 3
        this.currentScore = 0
        this.level = 1
      }
      this.resetGame()
    }
  }

  addObj() {
    const rnd = Phaser.Math.Between(0, 10)
    const type = rnd < 5 ? 'score' : 'penalty'
    const x = Phaser.Math.Between(0, this.scale.width)
    const y = Phaser.Math.Between(0, this.scale.height)
    const obj = this.physics.add.sprite(x, y, type)
    if (type === 'score') {
      this.score.add(obj, true)
    } else {
      const scale = .1 * Phaser.Math.Between(5, 12)
      obj.setScale(scale)
      this.penalty.add(obj, true)
    }
    this.gameTimer.reset({
      delay: DELAY * this.coeffDelay,
      callback: this.addObj,
      callbackScope: this
    })
  }

  resetGame() {
    this.coeffDelay = 1
    this.collected = 0

    this.score.clear(true, true)
    this.penalty.clear(true, true)

    const { width, height } = this.scale
    this.actor.setPosition(width / 2, height / 2)

    this.updateInfo()
  }

  updateInfo() {
    this.debText.setText([
      `level: ${this.level}`,
      `score: ${this.currentScore}`,
      `rest: ${this.rest}`,
    ])
  }
}
