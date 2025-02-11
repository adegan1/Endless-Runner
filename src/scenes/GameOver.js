class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene')
    }

    init() {
        this.bgSpeed = .25

        this.highScoreFlashTimer = 0
        this.highScoreFlashCooldown = 8
        this.highScoreFlash = false
    }

    create() {
        // set high score
        if (highScore > 0) {
            if (playerScore > highScore) {
                highScore = playerScore
                newHighScore = true
            } else {
                newHighScore = false
            }
        } else {
            // set new high score if one doesn't exist
            highScore = playerScore
            newHighScore = true
        }

        // text config
        this.titleTextConfig = {
            fontFamily: 'upheaval',
            fontSize: '100px',
            color: '#222034',
            align: 'center',
            padding: {
                top: 14,
            },
        };

        this.scoreTextConfig = {
            fontFamily: 'upheaval',
            fontSize: '55px',
            color: '#e0e0e0',
            align: 'center',
            padding: {
                top: 14,
            },
        };

        this.buttonTextConfig = {
            fontFamily: 'upheaval',
            fontSize: '50px',
            color: '#e0e0e0',
            align: 'center',
            padding: {
                top: 14,
            },
        };

        // background tilesprites
        this.sky_bg = this.add.tileSprite(0, 0, 1080, 640, 'sky_bg').setOrigin(0,0)
        this.sky_bg.tilePositionX -= width * 2.5        // offset sky background image
        this.hills_bg_far = this.add.tileSprite(0, 0, 1080, 640, 'hills_bg_far').setOrigin(0,0)
        this.hills_bg_mid = this.add.tileSprite(0, 0, 1080, 640, 'hills_bg_mid').setOrigin(0,0)
        this.hills_bg_close = this.add.tileSprite(0, 0, 1080, 640, 'hills_bg_close').setOrigin(0,0)

        // title text
        this.titleTextBG = this.add.text(width / 2, height / 12, "GAME OVER", this.titleTextConfig).setOrigin(0.5, 0)
        this.titleTextConfig.fontSize = '95px'
        this.titleTextConfig.color = '#e0e0e0'
        this.titleText = this.add.text(width / 2, height / 12, "GAME OVER", this.titleTextConfig).setOrigin(0.5, 0)

        // score texts
        this.newHighScoreText = this.add.text(width / 2, height / 4.5, "NEW HIGH SCORE!", this.scoreTextConfig).setOrigin(0.5, 0)
        this.thisScoreText = this.add.text(width / 2, height / 3.25, "Score:\n" + Math.floor(playerScore), this.scoreTextConfig).setOrigin(0.5, 0)
        this.highScoreText = this.add.text(width / 2, height / 2.15, "High Score:\n" + Math.floor(highScore), this.scoreTextConfig).setOrigin(0.5, 0)

        this.newHighScoreText.visible = false

        // buttons
        this.restartButton = this.add.sprite(width / 8 * 3, height / 1.3, 'button').setScale(2)
        this.restartButton = this.add.text(this.restartButton.x, this.restartButton.y - this.restartButton.height, "Retry", this.buttonTextConfig).setOrigin(0.5,0)
        this.restartButton.setInteractive()
        this.restartButton.on('pointerover', () => {
            this.restartButton.setTint(0x847e87)
        })
        this.restartButton.on('pointerout', () => {
            this.restartButton.clearTint()
        })
        this.restartButton.on('pointerdown', () => {
            this.scene.start('playScene')
        })

        this.menuButton = this.add.sprite(width / 8 * 5, height / 1.3, 'button').setScale(2)
        this.menuText = this.add.text(this.menuButton.x, this.menuButton.y - this.menuButton.height, "Title", this.buttonTextConfig).setOrigin(0.5,0)
        this.menuButton.setInteractive()
        this.menuButton.on('pointerover', () => {
            this.menuButton.setTint(0x847e87)
        })
        this.menuButton.on('pointerout', () => {
            this.menuButton.clearTint()
        })
        this.menuButton.on('pointerdown', () => {
            this.scene.start('menuScene')
        })
    }

    update() {
        // move tilesprites
        this.hills_bg_far.tilePositionX -= this.bgSpeed * 1
        this.hills_bg_mid.tilePositionX -= this.bgSpeed * 2.5
        this.hills_bg_close.tilePositionX -= this.bgSpeed * 6

        // show and flash highscore 
        if (newHighScore) {
            this.newHighScoreText.visible = true

            if (this.highScoreFlashTimer >= 0) {
                this.highScoreFlashTimer--
            }
    
            if (this.highScoreFlashTimer <= 0) {
                this.highScoreFlashTimer = this.highScoreFlashCooldown
                this.highScoreFlash = !this.highScoreFlash
            }
    
            if (this.highScoreFlash) {
                this.newHighScoreText.setTint(0xedc31a)
            } else {
                this.newHighScoreText.clearTint()
            }
        }
    }
}