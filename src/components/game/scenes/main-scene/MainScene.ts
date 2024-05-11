import { DELAY, DELAY_STEP, MODIFIER_DELAY, MODIFIER_WAIT } from "../../constants";
import { Modifier, Player, Score } from "../../entities";
import { ModifierStates } from "../../entities/modifier";
import { Directions, Swipe } from "../../swipe";
import { createAnimations } from "./";

export class MainScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private swipe!: Swipe
  private freeze = false

  private actor!: Player

  private scoreGrp!: Phaser.GameObjects.Group
  private penaltyGrp!: Phaser.GameObjects.Group
  private modifierGrp!: Phaser.GameObjects.Group

  private gameTimer!: Phaser.Time.TimerEvent
  private modifierTimer!: Phaser.Time.TimerEvent

  private currentScore = 0
  private level = 0
  private rest = 3
  private collected = 0

  private coeffDelay = 1

  private msgText!: Phaser.GameObjects.Text
  private debText!: Phaser.GameObjects.Text

  constructor() {
    super('main')
  }

  preload() {
    this.load.spritesheet('player', 'assets/char.png', { frameWidth: 70, frameHeight: 100 });
    this.load.image('score', 'assets/score.png');
    this.load.image('penalty', 'assets/penalty.png');
    this.load.image('modifier', 'assets/modifier.png');
  }

  create() {
    createAnimations(this.anims)

    this.actor = new Player(this, 100, 100)

    this.scoreGrp = this.add.group()
    this.penaltyGrp = this.add.group()
    this.modifierGrp = this.add.group()

    this.gameTimer = this.time.delayedCall(DELAY, this.addObj, [], this)
    this.modifierTimer = this.time.delayedCall(MODIFIER_DELAY, this.addModifier, [], this)

    this.cursors = this.input.keyboard?.createCursorKeys()

    this.swipe = new Swipe(this)
    this.swipe.addListeners({
      onMove: this.actor.walk.bind(this.actor),
      onUp: () => { }
    })

    this.scale.addListener(Phaser.Scale.Events.RESIZE, ({ width, height }: { width: number, height: number }) => {
      console.log('RESIZE!!1');
      this.debText.setText([
        `width: ${width}`,
        `height: ${height}`
      ])
    }, this)

    this.msgText = this.add.text(this.scale.width / 2, this.scale.height / 2, '', { fontSize: '40px', color: '#ffffff' })
    this.msgText.setOrigin(.5)
    this.msgText.visible = false;
    this.debText = this.add.text(0, 0, 'deb', { fontSize: '20px', color: '#ffffff' })

    this.levelUp()
  }

  update() {
    if (this.freeze) {
      return
    }

    if (this.cursors?.down.isDown) {
      this.actor.walk({ direction: Directions.Down })
    }
    if (this.cursors?.up.isDown) {
      this.actor.walk({ direction: Directions.Up })
    }
    if (this.cursors?.right.isDown) {
      this.actor.walk({ direction: Directions.Right })
    }
    if (this.cursors?.left.isDown) {
      this.actor.walk({ direction: Directions.Left })
    }

    // *** COLLISIONS ***
    // score
    if (this.physics.overlap(this.actor, this.scoreGrp, (actor, score) => {
      (actor as Player).score()
      const cScore = score as Score
      this.scoreGrp.remove(cScore)
      cScore.collect()
    })) {
      this.coeffDelay = Math.max(this.coeffDelay - DELAY_STEP, .1)
      this.currentScore += 10
      this.collected++
      if (this.collected >= 10) {
        this.levelUp()
      }
      this.updateInfo()
    }

    // modifier
    if (this.physics.overlap(this.actor, this.modifierGrp, (actor, modifier) => {
      console.log(actor);
      const cModifier = modifier as Modifier;
      this.modifierGrp.remove(cModifier)
      cModifier.collect()
      switch (cModifier.state) {
        case ModifierStates.TimeIncrease:
        default:
          this.coeffDelay = Math.max(this.coeffDelay + DELAY_STEP, 1)
      }
    })) {
      this.resetModifierTimer()
    }

    // penalty
    if (this.physics.overlap(this.actor, this.penaltyGrp)) {
      this.freeze = true
      this.rest--
      if (this.rest === 0) {
        this.actor.damage()
        this.gameOver()
      } else {
        this.actor.damage(this.resetGame)
      }
    }
  }

  addObj() {
    const rnd = Phaser.Math.Between(0, 10)
    const type = rnd < 5 ? 'score' : 'penalty'
    const { x, y } = this.getRandom()
    const obj = type === 'score'
      ? this.physics.add.existing(new Score(this, x, y))
      : this.physics.add.sprite(x, y, type)
    if (type === 'score') {
      this.scoreGrp.add(obj, true)
    } else {
      const scale = .1 * Phaser.Math.Between(5, 12)
      obj.setScale(scale)
      this.penaltyGrp.add(obj, true)
    }
    this.gameTimer.reset({
      delay: DELAY * this.coeffDelay,
      callback: this.addObj,
      callbackScope: this
    })
  }

  addModifier() {
    const modifier = new Modifier(this)
    const { x, y } = this.getRandom()
    modifier.setPosition(x, y)
    this.modifierGrp.add(modifier)

    this.modifierTimer.reset({
      delay: MODIFIER_WAIT,
      callback: this.resetModifierTimer,
      callbackScope: this
    })
  }

  resetModifierTimer() {
    this.modifierGrp.clear(true, true)
    this.modifierTimer.reset({
      delay: MODIFIER_DELAY,
      callback: this.addModifier,
      callbackScope: this
    })
  }

  resetGame() {
    this.coeffDelay = 1
    this.collected = 0

    this.scoreGrp.clear(true, true)
    this.penaltyGrp.clear(true, true)

    const { width, height } = this.scale
    this.actor.setPosition(width / 2, height / 2)
    this.actor.setAlpha(1)
    this.msgText.visible = false

    this.updateInfo()
    if (this.level === 0) {
      this.levelUp()
    } else {
      this.freeze = false
    }
  }

  showMessage(msg: string, onComplete: () => void, completeDelay = 1000) {
    this.freeze = true

    const { width, height } = this.scale
    this.msgText.setPosition(width / 2, height / 2)
    this.msgText.visible = true
    this.msgText.setText(msg)

    this.tweens.add({
      targets: this.msgText,
      duration: 70,
      alpha: 0,
      yoyo: true,
      repeat: 3,
      callbackScope: this,
      completeDelay,
      onComplete,
    })
  }

  levelUp() {
    this.level++
    this.showMessage(`LEVEL: ${this.level}`, this.resetGame)
  }

  gameOver() {
    this.rest = 3
    this.currentScore = 0
    this.level = 0
    this.showMessage('GAME OVER', this.resetGame, 3 * 1000)
  }

  getRandom(): Phaser.Types.Math.Vector2Like {
    return {
      x: Phaser.Math.Between(0, this.scale.width),
      y: Phaser.Math.Between(0, this.scale.height),
    }
  }

  updateInfo() {
    this.debText.setText([
      `level: ${this.level}`,
      `score: ${this.currentScore}`,
      `rest: ${this.rest}`,
    ])
  }
}
