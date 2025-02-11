class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    init() {
        this.bgSpeed = .25
    }

    preload() {
        this.load.path = './assets/visual/'

        // load background elements
        this.load.image('sky_bg', 'bg.png')
        this.load.image('hills_bg_close', 'hills_bg_1.png')
        this.load.image('hills_bg_mid', 'hills_bg_2.png')
        this.load.image('hills_bg_far', 'hills_bg_3.png')

        // load visual elements
        this.load.image('title', 'title.png')
        this.load.image('title_screen', 'title_screen.png')
        this.load.image('button', 'button.png')

        // load font
        this.load.font('upheaval', 'fonts/upheavtt.ttf', 'truetype')
    }

    create() {
        // text config
        this.buttonTextConfig = {
            fontFamily: 'upheaval',
            fontSize: '50px',
            color: '#e0e0e0',
            align: 'center',
            padding: {
                top: 14,
            },
            fixedWidth: 200
        };

        this.textConfigCenter = {
            fontFamily: 'upheaval',
            fontSize: '22px',
            color: '#e0e0e0',
            align: 'center',
        };

        this.textConfigLeft = {
            fontFamily: 'upheaval',
            fontSize: '18px',
            color: '#d7d7d7',
            align: 'left',
        };

        // background tilesprites
        this.sky_bg = this.add.tileSprite(0, 0, 1080, 640, 'sky_bg').setOrigin(0,0)
        this.sky_bg.tilePositionX -= width / 2      // offset sky background image
        this.hills_bg_far = this.add.tileSprite(0, 0, 1080, 640, 'hills_bg_far').setOrigin(0,0)
        this.hills_bg_mid = this.add.tileSprite(0, 0, 1080, 640, 'hills_bg_mid').setOrigin(0,0)
        this.hills_bg_close = this.add.tileSprite(0, 0, 1080, 640, 'hills_bg_close').setOrigin(0,0)

        // title
        this.title_screen = this.add.sprite(0, 0, 'title_screen').setOrigin(0,0)
        this.title = this.add.sprite(width / 7 * 4, height / 5, 'title').setScale(1.5)

        // buttons
        this.playButton = this.add.sprite(width / 12 * 5, height / 2, 'button').setScale(2)
        this.playText = this.add.text(this.playButton.x - this.playButton.width, this.playButton.y - this.playButton.height, "Play", this.buttonTextConfig)
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

        // side texts
        this.instructionTextTitle = this.add.text(width / 6.39, height / 4,
            "Instructions",
            this.textConfigCenter).setOrigin(.5, 0)
        this.instructionText = this.add.text(width / 11.75, height / 3.38,
            "Run as far as\npossible while\navoiding and\ndestroying\nspiked balls!\nTry to beat your\nhigh score!",
            this.textConfigLeft).setOrigin(0,0)

        this.controlsTextTitle = this.add.text(width / 6.39, height / 1.67,
            "Controls",
            this.textConfigCenter).setOrigin(.5, 0)
        this.controlsText = this.add.text(width / 11.75, height / 1.55,
            "Move: <-/->, A/D\nJump: SPACE\nShoot: SHIFT\nAirborne:\n Air Jump: SPACE\n Dive: ↓, S\n",
            this.textConfigLeft).setOrigin(0,0)

        this.creditsTextTitle = this.add.text(width / 1.275, height / 1.46,
            "Credits",
            this.textConfigCenter).setOrigin(.5, 0)
        this.creditsText = this.add.text(width / 1.52, height / 1.37,
            "Programming: Andrew Degan\nArt Assets: Andrew Degan\nSFX / Music: Andrew Degan\n\nCharacter Art: Jungle Pack\n                       (on itch.io)\nFont: Upheaval by Ænigma\nFramework: Phaser v3.87",
            this.textConfigLeft).setOrigin(0,0)

        this.highScoreTextTitle = this.add.text(width / 1.98, height / 1.22,
            "High Score",
            this.textConfigCenter).setOrigin(.5, 0)
        this.highScoreText = this.add.text(width / 1.98, height / 1.15,
            "insert score",
            this.textConfigCenter).setOrigin(.5,0)

        this.textConfigLeft.align = "right"
        this.classText = this.add.text(width / 1.35, 0,
            "UCSC - CMPM120 - Winter 2025\nNathan Altice",
            this.textConfigLeft).setOrigin(0,0)
    }

    update() {
        // move tilesprites
        this.hills_bg_far.tilePositionX += this.bgSpeed * 1
        this.hills_bg_mid.tilePositionX += this.bgSpeed * 2.5
        this.hills_bg_close.tilePositionX += this.bgSpeed * 6
    }
}