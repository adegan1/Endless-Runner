class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width, this.height)
        this.body.setAllowGravity(false)
        this.body.immovable = true
        //this.body.setVelocityX(-250)
    }
}