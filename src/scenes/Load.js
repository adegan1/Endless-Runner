class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // load visual elements
        this.load.path = './assets/visual/'
        this.load.image('platform1', 'platform1.png')

        this.load.spritesheet('player', 'player.png', {
            frameWidth: 32,
            frameHeight: 64
        })
    }

    create() {


        // enter play scene
        this.scene.start('playScene')
    }
}