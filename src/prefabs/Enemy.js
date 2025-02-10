class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, enemySpawnOffset, gameSpeed, behavior) {
        super(scene, x, Phaser.Math.Between(ENEMY_HEIGHT_MAX + enemySpawnOffset, ENEMY_HEIGHT_MAX), 'enemy')

        this.parentScene = scene

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setCircle(this.width / 2, this.height / 2)
        this.body.setOffset(0, 0)
        this.setDepth(1)

        this.VELOCITY_X_MIN = -500
        this.VELOCITY_X_MAX = -300
        this.velocityMult = 1.75

        this.VELOCITY_Y_MIN = 300
        this.VELOCITY_Y_MAX = -300

        this.rotationSpeed = -6

        this.enemyVelocity = Phaser.Math.Between(this.VELOCITY_X_MIN, this.VELOCITY_X_MAX)

        switch(behavior) {
            case 1:
                this.body.setAllowGravity(false)
                this.setVelocityX(this.enemyVelocity * gameSpeed * this.velocityMult)
                break;
            case 2:
                this.body.setAllowGravity(false)
                this.body.setBounceY(1)
                this.setVelocityX(this.enemyVelocity * gameSpeed)
                this.body.setVelocityY(Phaser.Math.Between(this.VELOCITY_Y_MIN, this.VELOCITY_Y_MAX))
                scene.physics.add.collider(this, scene.platformGroup)
                break;
            case 3:
                this.body.setAllowGravity(true)
                this.body.setMaxVelocityY(1000)
                this.body.setBounceY(50)
                this.setY(0)
                this.setVelocityX(this.enemyVelocity * gameSpeed)
                scene.physics.add.collider(this, scene.platformGroup)
                break;
        }
    }

    update() {
        this.angle += this.rotationSpeed
    }
}