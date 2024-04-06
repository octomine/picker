class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture = '', frame = 0) {
    super(scene, x, y, texture, frame)

    this.scene = scene;
    this.scene.add.existing(this)
    this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)
  }
}

export default Entity
