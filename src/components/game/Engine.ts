import 'phaser'
import { MainScene } from './scenes'

const config = {
    type: Phaser.AUTO,
    title: 'game',
    scene: [MainScene],
    physics: {
        default: 'arcade'
    }
}

export const game = new Phaser.Game(config)
