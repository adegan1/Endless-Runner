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

        this.bgSpeed = 1

        // initialize score variables
        this.alive = true

        playerScore = 0
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

        this.footprintTimer = 0
    }

    create() {
        // place tile sprites
        this.sky_bg = this.add.tileSprite(0, 0, 1080, 640, 'sky_bg').setOrigin(0,0)
        this.sky_bg.tilePositionX -= width / 2      // offset sky background image
        this.hills_bg_far = this.add.tileSprite(0, 0, 1080, 640, 'hills_bg_far').setOrigin(0,0)
        this.hills_bg_mid = this.add.tileSprite(0, 0, 1080, 640, 'hills_bg_mid').setOrigin(0,0)
        this.hills_bg_close = this.add.tileSprite(0, 0, 1080, 640, 'hills_bg_close').setOrigin(0,0)

        this.physics.world.setBounds(0, -height, width, height * 3)

        // add player
        this.player = new Player(this, this.playerStartPos, height / 6, 'player', 0).setOrigin(0,0).setScale(2.5)
        this.player.body.setSize(this.player.width / 2.5, this.player.height / 5 * 4)
        this.player.body.setOffset(this.player.width / 3, this.player.height / 6)

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

        // add particles
        // enemy destroy particles
        this.enemyEmitter = this.add.particles(0, 0, 'enemy_part', {
            lifespan: 500,
            speed: { min: 150, max: 250 },
            alpha: { start: 1, end: 0},
            scale: { start: 2, end: 1 },
            rotate: { min: 0, max: 360},
            gravityY: 500,
            emitting: false
        });

        // player footprint particles
        this.footprintEmitter = this.add.particles(this.player.width / 2, this.player.height * 2.3, 'grass_particle', {
            lifespan: 500,
            scale: { start: 1.5, end: .5, },
            alpha: { start: .75, end: .25 },
            rotate: { min: 0, max: 360 },
            angle: { min: 180, max: 200 },
            speed: 150,
            frequency: 10,
            duration: 20,
            emitting: false
        });

        // player air jump particle
        this.airJumpEmitter = this.add.particles(this.player.width, this.player.height * 2.3, 'air_jump_particle', {
            lifespan: 300,
            scale: { start: 2, end: .5, },
            alpha: { start: 1, end: 0 },
            angle: 90,
            speed: 75,
            emitting: false
        });

        this.footprintEmitter.startFollow(this.player)
        this.airJumpEmitter.startFollow(this.player)

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
            this.enemyEmitter.startFollow(enemy)
            this.enemyEmitter.explode(6)

            this.shotGroup.remove(shot)
            this.enemyGroup.remove(enemy)
            shot.destroy()
            enemy.destroy()

            playerScore += this.enemyPoints
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

        // display score
        this.scoreConfig = {
            fontFamily: 'upheaval',
            fontSize: '48px',
            color: '#e0e0e0',
            align: 'center',
            padding: {
                top: 8,
                bottom: 18,
            },
            fixedWidth: 200
        };
        this.scoreBg = this.add.sprite(10, height / 100, 'score_bg').setOrigin(0,0)
        this.scoreBg.setDepth(2)
        this.scoreText = this.add.text(10, height / 100, playerScore, this.scoreConfig)
        this.scoreText.setDepth(2)

        // display health
        this.healthSprite = this.add.sprite(10, height / 100 + this.scoreText.height, 'health', 0).setOrigin(0,0).setScale(2)
        this.healthSprite.setDepth(2)

        // camera fade
        this.cameras.main.fadeIn(500, 34, 32, 52)
    }

    update() {
        // update the player's state machine
        this.player.grounded = this.player.body.touching.down
        this.playerFSM.step()

        // reset jumps if grounded
        if (this.player.grounded) {
            this.player.jumps = this.player.EXTRA_JUMPS
        }

        // move tilesprites
        this.sky_bg.tilePositionX += (this.bgSpeed * .5) * this.gameSpeed
        this.hills_bg_far.tilePositionX += (this.bgSpeed * 1) * this.gameSpeed
        this.hills_bg_mid.tilePositionX += (this.bgSpeed * 2.5) * this.gameSpeed
        this.hills_bg_close.tilePositionX += (this.bgSpeed * 6) * this.gameSpeed
        
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

        if (this.footprintTimer >= 0) {
            this.footprintTimer--
        }

        // spawn enemies
        if (this.enemyTimer <= 0) {
            this.spawnEnemy()
        }

        // kill player if they fall off screen
        if (this.player.y >= height * 1.5) {
            this.lives = 0
        }

        // game over
        if (this.lives <= 0) {
            this.alive = false

            if (playerScore > highScore) {
                highScore = playerScore
                newHighScore = true
            }

            this.time.delayedCall(500, () => { this.scene.start('gameOverScene'); });
        }

        // increment game speed
        if (this.gameSpeed < this.MAX_SPEED) {
            this.gameSpeed += this.speedIncrease
        }

        // update player score
        if (this.alive) {
            this.updateScore()
        }

        // update player health sprite
        this.healthSprite.setFrame(3 - this.lives)

        // set player animations
        if (this.player.body.velocity.y < 0) {
            this.player.anims.play('jump')
        } else if (this.player.body.velocity.y > 0) {
            this.player.anims.play('fall')
        } else {
            if (this.player.anims.isPlaying && this.player.anims.currentAnim.key != 'run') {
                this.footprintEmitter.emitting = true
                this.player.anims.play('run')
            }

            if (this.footprintTimer <= 0) {
                this.footprintTimer = 10 / this.gameSpeed
                this.footprintEmitter.explode(1)
            }
        }
    }

    spawnPlatform() {
        this.platformSpawnLoc = width + (width * this.gameSpeed / this.PLATFORM_GAP_OFFSET)

        let platform = new Platform(this, this.platformVelocity * this.gameSpeed, this.platformSpawnLoc).setOrigin(0,0)
        this.platformGroup.add(platform)

        this.lastPlatformY = platform.y
    }

    spawnShot() {
        let shot = new Shot(this, this.shotVelocity, this.player.x + this.player.width, this.player.y + (this.player.height / 1.5)).setOrigin(0,0)
        this.shotGroup.add(shot)
    }

    spawnEnemy() {
        this.enemyTimer = this.enemyCooldown
        this.enemyBehavior = Phaser.Math.Between(1,3)
        let enemy = new Enemy(this, width * 1.1, this.lastPlatformY - this.enemyHeight * 3, this.gameSpeed, this.enemyBehavior).setOrigin(.5,.5)
        this.enemyGroup.add(enemy)
    }

    updateScore() {
        this.playerLocBonus = (this.player.x - this.playerStartPos) * this.playerPosMult
        playerScore += (this.TIME_MULT * this.gameSpeed)
        if (this.player.x > this.playerStartPos) {
            playerScore += this.playerLocBonus
        }

        this.roundScore = Math.floor(playerScore)
        this.scoreText.text = this.roundScore
    }

    airjumpParticle() {
        this.airJumpEmitter.explode(1)
    }
}