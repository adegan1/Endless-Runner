class Shot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, x, y) {
        super(scene, x, y, 'shot')

        this.parentScene = scene

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setCircle(this.width, this.height)
        this.body.setOffset(-this.width / 2, -this.height / 2)
        this.body.setAllowGravity(false)

        this.setVelocityX(velocity)
    }
}