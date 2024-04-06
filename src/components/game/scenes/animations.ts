export const createAnimations = (anims: Phaser.Animations.AnimationManager) => {
  // player
  anims.create({
    key: 'walkRight',
    frames: anims.generateFrameNumbers('player', { start: 0, end: 4 }),
    frameRate: 20,
    repeat: -1,
  })
  anims.create({
    key: 'walkLeft',
    frames: anims.generateFrameNumbers('player', { start: 5, end: 9 }),
    frameRate: 20,
    repeat: -1,
  })
  anims.create({
    key: 'walkDown',
    frames: anims.generateFrameNumbers('player', { start: 10, end: 14 }),
    frameRate: 20,
    repeat: -1,
  })
  anims.create({
    key: 'walkUp',
    frames: anims.generateFrameNumbers('player', { start: 15, end: 19 }),
    frameRate: 20,
    repeat: -1,
  })
  anims.create({
    key: 'stay',
    frames: anims.generateFrameNumbers('player', { start: 10, end: 10 }),
    frameRate: 20,
    repeat: 0,
  })
}
