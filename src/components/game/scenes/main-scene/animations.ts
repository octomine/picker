export const createAnimations = (anims: Phaser.Animations.AnimationManager) => {
  // player
  anims.create({
    key: 'WalkRight',
    frames: anims.generateFrameNumbers('player', { start: 0, end: 4 }),
    frameRate: 20,
    repeat: -1,
  })
  anims.create({
    key: 'WalkLeft',
    frames: anims.generateFrameNumbers('player', { start: 5, end: 9 }),
    frameRate: 20,
    repeat: -1,
  })
  anims.create({
    key: 'WalkDown',
    frames: anims.generateFrameNumbers('player', { start: 10, end: 14 }),
    frameRate: 20,
    repeat: -1,
  })
  anims.create({
    key: 'WalkUp',
    frames: anims.generateFrameNumbers('player', { start: 15, end: 19 }),
    frameRate: 20,
    repeat: -1,
  })
  anims.create({
    key: 'Stay',
    frames: anims.generateFrameNumbers('player', { start: 10, end: 10 }),
    frameRate: 20,
    repeat: 0,
  })
}
