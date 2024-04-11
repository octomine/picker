class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture = '', frame = 0) {
    super(scene, x, y, texture, frame)

    this.scene = scene;
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
  }
}

export default Entity
