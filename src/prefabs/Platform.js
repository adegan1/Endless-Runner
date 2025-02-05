class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width, this.height)
        this.body.setAllowGravity(false)
        this.body.immovable = true
        this.setFriction(0)

        // set platform properties
        this.SPAWN_RECUR_LOC = width / 10
        this.DESPAWN_LOC = 0

        this.platformVelocity = -850

        // initiate a state machine to manage platforms
        scene.platformFSM = new StateMachine('spawn', {
            spawn: new SpawnState(),
            spawnNew: new SpawnNewState(),
            despawn: new DespawnState(),
        }, [scene, this])
    }
}

// platform state classes
class SpawnState extends State {
    enter(scene, platform) {
        platform.setVelocityX(platform.platformVelocity)
    }

    execute(scene, platform) {
        if (platform.x <= platform.SPAWN_RECUR_LOC) {
            this.stateMachine.transition('spawnNew')
        }

        if (platform.x <= platform.DESPAWN_LOC) {
            this.stateMachine.transition('despawn')
        }
    }
}

class SpawnNewState extends State {
    enter(scene, platform) {
        scene.spawnPlatform()
        this.stateMachine.transition('spawn')
    }
}

class DespawnState extends State {
    enter(scene, platform) {
        console.log("despawn platform")
        platform.destroy()
    }
}