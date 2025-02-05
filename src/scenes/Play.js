class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // variables and settings
        this.physics.world.gravity.y = 2600

        // set platform properties
        this.SPAWN_LOC = width + (width / 3 * 2)
        this.HEIGHT_MIN = height / 5 * 4
        this.HEIGHT_MAX = height / 5 * 2

        // initialize score variables
        this.playerScore = 0
    }

    preload() {

    }

    create() {
        // change background color
        this.cameras.main.setBackgroundColor('#d17c60')

        // add platforms
        this.platformInit = new Platform(this, 0, height / 4 * 3, 'platform1').setOrigin(0,0)

        this.platforms = this.add.group([this.platformInit])

        // add player
        this.player = new Player(this, width / 6, height / 4 * 2, 'player', 0).setOrigin(0,0)

        // add physics collider
        this.physics.add.collider(this.player, this.platforms)

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
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 90
        };
        this.scoreText = this.add.text(width / 2.35, height / 100, '$' + this.playerScore, this.scoreConfig);
    }

    update() {
        this.player.grounded = this.player.body.touching.down

        // update the player's state machine
        this.playerFSM.step()
        this.platformFSM.step()
    }

    spawnPlatform() {
        this.newPlatform = new Platform(this, this.SPAWN_LOC, Phaser.Math.Between(this.HEIGHT_MIN, this.HEIGHT_MAX), 'platform1').setOrigin(0,0)
        this.physics.add.collider(this.player, this.newPlatform)
    }
}