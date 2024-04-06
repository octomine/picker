import { Entity } from "."

class Modifier extends Entity {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'modifier')
  }
}

export default Modifier
