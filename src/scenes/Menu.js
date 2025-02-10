class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        // load visual elements
        this.load.path = './assets/visual/'
        this.load.image('title', 'title.png')
        this.load.image('button', 'button.png')

        // load font
        this.load.font('upheaval', 'fonts/upheavtt.ttf', 'truetype')
    }

    create() {
        // text config
        this.textConfig = {
            fontFamily: 'upheaval',
            fontSize: '32px',
            color: '#e0e0e0',
            align: 'center',
            padding: {
                top: 24,
            },
            fixedWidth: 200
        };

        // title
        this.title = this.add.sprite(width / 2, height / 5, 'title').setScale(1.5)

        // buttons
        this.playButton = this.add.sprite(width / 2, height / 2, 'button').setScale(1.5)
        this.playText = this.add.text(this.playButton.x - this.playButton.width, this.playButton.y - this.playButton.height, "Play", this.textConfig)
        this.playButton.setInteractive()
        this.playButton.on('pointerover', () => {
            this.playButton.setTint(0x847e87)
        })
        this.playButton.on('pointerout', () => {
            this.playButton.clearTint()
        })
        this.playButton.on('pointerdown', () => {
            // enter load scene
            this.scene.start('loadScene')
        })
    }
}