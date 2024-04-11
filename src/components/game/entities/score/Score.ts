import { Entity } from "..";

class Score extends Entity {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'score')

    this.setOrigin(.5, 1)
    this.setScale(0)
    this.scene.tweens.add({
      targets: this,
      scale: 1,
      duration: 100,
      ease: 'Quintic.easeInOut',
    })
  }

  collect() {
    this.scene.tweens.add({
      targets: this,
      duration: 300,
      scale: 1.5,
      alpha: 0,
      y: this.y - 50,
      ease: 'Quintic.easeInOut',
      onComplete: () => {
        this.destroy()
      }
    })
  }
}

export default Score
