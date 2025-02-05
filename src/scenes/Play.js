class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // variables and settings
        this.physics.world.gravity.y = 2600

        // initialize score variables
        this.playerScore = 0
    }

    preload() {

    }

    create() {
        // change background color
        this.cameras.main.setBackgroundColor('#d17c60')

        // add platforms
        this.platform1 = new Platform(this, 0, height / 4 * 3, 'platform1').setOrigin(0,0)

        // add player
        this.player = new Player(this, width / 6, height / 4 * 2, 'player', 0).setOrigin(0,0)

        // add physics collider
        this.physics.add.collider(this.player, this.platform1)

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
    }
}