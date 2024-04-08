import { Entity } from "."

class Modifier extends Entity {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'modifier')

    this.setState(Phaser.Math.Between(0, 1))
  }

  collect() {
    this.scene.tweens.add({
      targets: this,
      duration: 200,
      y: this.y - 50,
      ease: 'Quintic.easeInOut',
    })

    this.scene.tweens.add({
      targets: this,
      duration: 100,
      scaleX: -1,
      repeat: 3,
      callbackScope: this.scene,
      onComplete: () => {
        this.destroy()
      }
    })
  }
}

export default Modifier
