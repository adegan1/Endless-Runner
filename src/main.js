// Project: Endless Runner
// Name: Andrew Degan

'use strict'

let config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 640,
    picelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [ Menu, Load, Play ]
}

let game = new Phaser.Game(config)

let { width, height } = game.config