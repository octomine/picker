import { MIN_DIST } from "../constants";
import { Player } from "../entities";

export class MainScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

  private actor!: Player
  private direction: Phaser.Types.Math.Vector2Like = { x: 0, y: 0 }
  private pressedPoint!: Phaser.Types.Math.Vector2Like
  private isDragging = false;

  private score!: Phaser.GameObjects.Group
  private penalty!: Phaser.GameObjects.Group
  private gameTimer!: Phaser.Time.TimerEvent

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
    this.anims.create({
      key: 'walkRight',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
      frameRate: 20,
      repeat: -1,
    })
    this.anims.create({
      key: 'walkLeft',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 9 }),
      frameRate: 20,
      repeat: -1,
    })
    this.anims.create({
      key: 'walkDown',
      frames: this.anims.generateFrameNumbers('player', { start: 10, end: 14 }),
      frameRate: 20,
      repeat: -1,
    })
    this.anims.create({
      key: 'walkUp',
      frames: this.anims.generateFrameNumbers('player', { start: 15, end: 19 }),
      frameRate: 20,
      repeat: -1,
    })
    this.anims.create({
      key: 'stay',
      frames: this.anims.generateFrameNumbers('player', { start: 10, end: 10 }),
      frameRate: 20,
      repeat: 0,
    })
    this.actor = new Player(this, 100, 100)

    this.score = this.add.group()
    this.penalty = this.add.group()
    this.gameTimer = this.time.delayedCall(2 * 1000, this.addObj, [], this)

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

    if (this.physics.overlap(this.actor, this.score, (actor, score) => {
      console.log(actor);
      this.score.remove(score as Phaser.GameObjects.GameObject)
      score.destroy(true)
    })) {
      //
    }

    if (this.physics.overlap(this.actor, this.penalty)) {
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
      this.penalty.add(obj, true)
    }
    this.gameTimer.reset({ delay: 2 * 1000, callback: this.addObj, callbackScope: this })
  }

  resetGame() {
    this.score.clear(true, true)
    this.penalty.clear(true, true)

    const { width, height } = this.scale
    this.actor.setPosition(width / 2, height / 2)
  }
}
