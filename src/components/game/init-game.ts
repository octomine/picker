import 'phaser'
import { MainScene } from './scenes/main-scene'

declare global {
  interface Window {
    game: Phaser.Game
  }
}

export const initGame = () => {
  const config = {
    type: Phaser.CANVAS,
    parent: 'game',
    canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
      mode: Phaser.Scale.RESIZE,
      parent: 'game',
      width: '100%',
      height: '100%',
    },
    scene: [MainScene],
    physics: {
      default: 'arcade',
      arcade: {
        // debug: true,
        // debugShowBody: true,
        // debugShowStaticBody: true,
        // debugShowVelocity: true,
      }
    },
  }
  window.game = new Phaser.Game(config)
}
