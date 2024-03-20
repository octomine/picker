import 'phaser'
import { MainScene } from './scenes'

const config = {
    type: Phaser.AUTO,
    title: 'game',
    width: 800,
    height: 600,
    scene: [MainScene],
    physics: {
        default: 'arcade'
    }
}

export const game = new Phaser.Game(config)
