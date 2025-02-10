class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene')
    }

    preload() {

    }

    create() {
        this.scene.start('menuScene')
    }
}