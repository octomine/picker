import 'phaser'
import { MainScene } from './scenes'

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
        scene: [MainScene],
        physics: {
            default: 'arcade'
        }
    }
    window.game = new Phaser.Game(config)
}
