import '../scss/game.scss';
import { SampleScene } from './scenes/sample_scene';

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Hello TS World',
    type: Phaser.AUTO,

    scale: {
        width:480,
        height: 320,
    },

    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },

    transparent: true,
    parent: 'game_container',
    scene:  SampleScene,
};

export const game = new Phaser.Game(gameConfig);
