class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // load visual elements
        this.load.path = './assets/visual/'
        this.load.image('platform', 'platform.png')
        this.load.image('shot', 'shot.png')
        this.load.image('enemy', 'enemy.png')

        this.load.spritesheet('player', 'player.png', {
            frameWidth: 32,
            frameHeight: 64
        })

        this.load.spritesheet('health', 'health.png', {
            frameWidth: 96,
            frameHeight: 32
        })
    }

    create() {
        // health "animation"
        this.anims.create({
            key: 'healthAnim',
            frameRate: 0,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('health', {start: 0, end: 2 })
        })

        // enter play scene
        this.scene.start('playScene')
    }
}