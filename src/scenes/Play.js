class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // variables and settings
        this.physics.world.gravity.y = 2600
        this.platformVelocity = -750
        this.playerStartPos = width / 6

        this.gameSpeed = .5
        this.speedIncrease = .00025
        this.MAX_SPEED = 2.5
        this.PLATFORM_GAP_OFFSET = 2.25

        // initialize score variables
        this.playerScore = 0
        this.playerPosMult = .0001
        this.TIME_MULT = .1
    }

    preload() {
 
    }

    create() {
        // change background color
        this.cameras.main.setBackgroundColor('#d17c60')

        // add platforms
        this.platformGroup = this.add.group({
            runChildUpdate: true
        })

        // add player
        this.player = new Player(this, this.playerStartPos, height / 6, 'player', 0).setOrigin(0,0)

        // wall that prevents player from exiting right side of screen
        let rightWall = this.physics.add.sprite(width, 0).setOrigin(0,0)
        rightWall.body.setAllowGravity(false).setSize(width / 4, height, false).setImmovable(true)
        let leftWall = this.physics.add.sprite(0 - width / 4, 0).setOrigin(0,0)
        leftWall.body.setAllowGravity(false).setSize(width / 4, height, false).setImmovable(true) 

        this.sideWalls = this.add.group([rightWall, leftWall])
        this.physics.add.collider(this.player, this.sideWalls)

        // add platforms
        let initPlatform = new Platform(this, this.platformVelocity * this.gameSpeed, width / 10).setOrigin(0,0) // spawn initial platform
        this.platformGroup.add(initPlatform)

        this.physics.add.collider(this.player, this.platformGroup)

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keys.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        // debug key listener
        this.input.keyboard.on('keydown-K', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

        // display score
        this.scoreConfig = {
            fontFamily: 'Copperplate',
            fontSize: '32px',
            backgroundColor: '#3d200c',
            color: '#a68b79',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 300
        };
        this.scoreText = this.add.text(10, height / 100, '$' + this.playerScore, this.scoreConfig);
    }

    update() {
        this.player.grounded = this.player.body.touching.down

        // update the player's state machine
        this.playerFSM.step()

        if (this.player.y >= height * 1.5) {
            this.scene.start('loadScene')
        }

        this.updateScore()

        if (this.gameSpeed < this.MAX_SPEED) {
            this.gameSpeed += this.speedIncrease
        }
    }

    spawnPlatform() {
        this.platformSpawnLoc = width + (width * this.gameSpeed / this.PLATFORM_GAP_OFFSET)

        let platform = new Platform(this, this.platformVelocity * this.gameSpeed, this.platformSpawnLoc).setOrigin(0,0)
        this.platformGroup.add(platform)
    }

    updateScore() {
        this.playerLocBonus = (this.player.x - this.playerStartPos) * this.playerPosMult
        this.playerScore += (this.TIME_MULT * this.gameSpeed)
        if (this.player.x > this.playerStartPos) {
            this.playerScore += this.playerLocBonus
        }

        this.roundScore = Math.floor(this.playerScore)
        this.scoreText.text = "$" + this.roundScore
    }
}