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

        this.shotVelocity = 2000

        // initialize score variables
        this.playerScore = 0
        this.playerPosMult = .0001
        this.TIME_MULT = .1

        // player shot cooldown
        this.shotCooldown = 25
        this.shotTimer = 0

        // initialize enemy variables
        this.enemyCooldown = 170
        this.enemyTimer = 50

        this.enemyPoints = 50
        this.lastPlatformY = 1

        this.enemyHeight = 48   // sprite y dimension

        // player lives and invincibility
        this.lives = 3

        this.playerIFrames = 60
        this.playerITimer = 0
    }

    create() {
        // change background color
        this.cameras.main.setBackgroundColor('#82e1ed')

        this.physics.world.setBounds(0, -height, width, height * 3)

        // add player
        this.player = new Player(this, this.playerStartPos, height / 6, 'player', 0).setOrigin(0,0)

        // add collider groups
        this.platformGroup = this.add.group({ runChildUpdate: true })

        this.shotGroup = this.add.group({ runChildUpdate: true })

        this.enemyGroup = this.add.group({ runChildUpdate: true })

        this.enemyWallGroup = this.add.group({ runChildUpdate: true })

        // add walls for enemies
        let topWall = this.physics.add.sprite(0, 0 - height / 4).setImmovable(true)
        topWall.body.setSize(width * 3, height / 2).setAllowGravity(false)
        this.enemyWallGroup.add(topWall)

        let bottomWall = this.physics.add.sprite(0, height * 1.25).setImmovable(true)
        bottomWall.body.setSize(width * 3, height / 2).setAllowGravity(false)
        this.enemyWallGroup.add(bottomWall)

        this.physics.add.collider(this.enemyGroup, this.enemyWallGroup)

        // delete shots that hit platforms
        this.physics.add.overlap(this.shotGroup, this.platformGroup, (shot) => {
            this.shotGroup.remove(shot)
            shot.destroy()
        })

        // damage player on enemy collision
        this.physics.add.overlap(this.player, this.enemyGroup, () => {
            //console.log('ouch, lives: ' + this.lives)
            if (this.playerITimer <= 0) {
                this.lives--
                this.playerITimer = this.playerIFrames

                // flash player to indicate invincibility
                this.player.alpha = 1
                this.tweens.add ({
                    targets: this.player,
                    alpha: 0,
                    duration: 80,
                    yoyo: true,
                    repeat: 5
                })
            }
        })

        // remove shot and enemy on collision
        this.physics.add.overlap(this.shotGroup, this.enemyGroup, (shot, enemy) => {
            this.shotGroup.remove(shot)
            this.enemyGroup.remove(enemy)
            shot.destroy()
            enemy.destroy()

            this.playerScore += this.enemyPoints
        })

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
        this.scoreText = this.add.text(10, height / 100, this.playerScore, this.scoreConfig);

        // display health
        this.healthSprite = this.add.sprite(10, height / 100 + this.scoreText.height, 'health', 0).setOrigin(0,0).setScale(2)
    }

    update() {
        // update the player's state machine
        this.player.grounded = this.player.body.touching.down
        this.playerFSM.step()
        
        // decrease cooldown timers
        if (this.shotTimer >= 0) {
            this.shotTimer--
        }

        if (this.enemyTimer >= 0) {
            this.enemyTimer--
        }

        if (this.playerITimer >= 0) {
            this.playerITimer--
        }

        // spawn enemies
        if (this.enemyTimer <= 0) {
            this.spawnEnemy()
        }

        // kill player if they fall off screen
        if (this.player.y >= height * 1.5) {
            this.lives = 0
        }

        if (this.lives <= 0) {
            this.scene.start('playScene')
        }

        // increment game speed
        if (this.gameSpeed < this.MAX_SPEED) {
            this.gameSpeed += this.speedIncrease
        }

        // update player score
        this.updateScore()

        // update player health sprite
        this.healthSprite.setFrame(3 - this.lives)
    }

    spawnPlatform() {
        this.platformSpawnLoc = width + (width * this.gameSpeed / this.PLATFORM_GAP_OFFSET)

        let platform = new Platform(this, this.platformVelocity * this.gameSpeed, this.platformSpawnLoc).setOrigin(0,0)
        this.platformGroup.add(platform)

        this.lastPlatformY = platform.y
    }

    spawnShot() {
        let shot = new Shot(this, this.shotVelocity, this.player.x + this.player.width, this.player.y + (this.player.height / 5)).setOrigin(0,0)
        this.shotGroup.add(shot)
    }

    spawnEnemy() {
        this.enemyTimer = this.enemyCooldown
        this.enemyBehavior = Phaser.Math.Between(1,3)
        let enemy = new Enemy(this, width * 1.1, this.lastPlatformY - this.enemyHeight * 3, this.gameSpeed, this.enemyBehavior).setOrigin(0,0)
        this.enemyGroup.add(enemy)
    }

    updateScore() {
        this.playerLocBonus = (this.player.x - this.playerStartPos) * this.playerPosMult
        this.playerScore += (this.TIME_MULT * this.gameSpeed)
        if (this.player.x > this.playerStartPos) {
            this.playerScore += this.playerLocBonus
        }

        this.roundScore = Math.floor(this.playerScore)
        this.scoreText.text = this.roundScore
    }
}