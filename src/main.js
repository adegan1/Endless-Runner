// Project: Pyoko Pyoko
// Name: Andrew Degan
// Time Spent: Roughly 30 hours
// Creative Tilt:
//  -I made the game reactive to the player, allowing the player to earn higher scores the more daring they are. For example, the player earns more points the closer they are to the front of the screen.
//  -I styled all of my art to keep the entire game uniform. I think that my game looks very visually interesting and clean.

// Additional Resources:
//  -Character Art: Jungle Pack on itch.io
//  -Font: Upheaval by Ænigma

'use strict'

let config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 640,
    pixelArt: true,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
        }
    },
    scene: [ Menu, Load, Play, GameOver ]
}

let game = new Phaser.Game(config)

let { width, height } = game.config

// define global variables
let PLATFORM_HEIGHT_MIN = height / 5 * 4
let PLATFORM_HEIGHT_MAX = height / 5 * 2
let ENEMY_HEIGHT_MAX = height / 10

let playerScore
let highScore
let newHighScore = false