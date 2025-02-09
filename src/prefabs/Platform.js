class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spawnLoc) {
        super(scene, spawnLoc, Phaser.Math.Between(PLATFORM_HEIGHT_MIN, PLATFORM_HEIGHT_MAX), 'platform')

        this.parentScene = scene

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width, this.height)
        this.body.setAllowGravity(false)
        this.body.immovable = true
        this.setFriction(0)

        // set platform properties
        this.SPAWN_RECUR_LOC = width / 10
        this.DESPAWN_LOC = 0 - width * 1.2

        this.newPlatform = true

        this.setVelocityX(velocity)
    }

    update() {
        // add new platform when reaching spawn recur location
        if (this.newPlatform && this.x <= this.SPAWN_RECUR_LOC) {
            this.parentScene.spawnPlatform(this.parent, this.velocity)
            this.newPlatform = false
        }

        // destroy platform if it goes too far left
        if (this.x <= this.DESPAWN_LOC) {
            this.destroy()
        }
    }
}