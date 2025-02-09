class Shot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, x, y) {
        super(scene, x, y, 'shot')

        this.parentScene = scene

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width, this.height)
        this.body.setAllowGravity(false)
        this.body.setCircle(true)

        this.setVelocityX(velocity)
    }
}