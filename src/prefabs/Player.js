class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        // set player properties
        this.MAX_JUMPS = 2
        this.JUMP_VELOCITY = -850
        this.DIVE_VELOCITY = 200
        this.LEFT_VELOCITY = -400
        this.RIGHT_VELOCITY = 150

        this.grounded = true
        this.jumps = this.MAX_JUMPS
        this.jumping = false;

        this.body.setSize(this.width - this.width, this.height)
        this.body.setAllowGravity(true)
        this.body.collideWorldBounds = true

        this.leftAnimSpeed = .75
        this.rightAnimSpeed = 1.25

        this.anims.play('run')

        // initiate a state machine to manage the player
        scene.playerFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
            dive: new DiveState(),
            shoot: new ShootState(),
        }, [scene, this])
    }
}

// player state classes
class IdleState extends State {
    enter(scene, player) {
        player.setVelocityX(0)
    }

    execute(scene, player) {
        // update run animation speed
        player.anims.timeScale = scene.gameSpeed

        // make a local copy of the keyboard object
        const { left, down, right, space, shift } = scene.keys
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey

        // transition depending on key pressed
        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('jump')
            return
        }

        // shoot
        if (shift.isDown && scene.shotTimer <= 0) {
            this.stateMachine.transition('shoot')
            return
        }

        if (left.isDown || right.isDown || AKey.isDown || DKey.isDown) {
            this.stateMachine.transition('move')
            return
        }

        // player dives if they hit down while not grounded
        if (!player.grounded) {
            if (down.isDown || SKey.isDown) {
                this.stateMachine.transition('dive')
            }
        }
    }
}

class MoveState extends State {
    execute(scene, player) {
        // make a local copy of the keyboard object
        const { left, down, right, space, shift } = scene.keys
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey

        // shoot
        if (shift.isDown && scene.shotTimer <= 0) {
            this.stateMachine.transition('shoot')
            return
        }

        // transition depending on key pressed
        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('jump')
            return
        }

        if (!(left.isDown || right.isDown || AKey.isDown || DKey.isDown)) {
            this.stateMachine.transition('idle')
            return
        }

        // player dives if they hit down while not grounded
        if (!player.grounded) {
            if (down.isDown || SKey.isDown) {
                this.stateMachine.transition('dive')
                return
            }
        }

        // handle movement
        if(left.isDown || AKey.isDown) {
            player.setVelocityX(player.LEFT_VELOCITY)

            // update run animation speed
            player.anims.timeScale = scene.gameSpeed * player.leftAnimSpeed
            return
        } else if (right.isDown || DKey.isDown) {
            player.setVelocityX(player.RIGHT_VELOCITY)

            // update run animation speed
            player.anims.timeScale = scene.gameSpeed * player.rightAnimSpeed
            return
        }
    }
}

class JumpState extends State {
    execute(scene, player) {
        // make a local copy of the keyboard object
        const { left, down, right, space, shift } = scene.keys
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey

        // reset jumps if grounded
        if (player.grounded) {
            player.jumps = player.MAX_JUMPS
        }

        // make player jump
        if (player.grounded && space.isDown) {
            player.setVelocityY(player.JUMP_VELOCITY)
            player.jumps--
        } else if (!player.grounded && player.jumps > 0 && space.isDown) {
            //console.log("Air Jump")
            player.setVelocityY(player.JUMP_VELOCITY)
            player.jumps--
        }

        this.stateMachine.transition('move')
    }
}

class DiveState extends State {
    enter(scene, player) {
        //console.log("Dive")
        player.setVelocityY(player.body.velocity.y + player.DIVE_VELOCITY)
        this.stateMachine.transition('move')
    }
}

class ShootState extends State {
    enter(scene, player) {
        //console.log("Shoot")
        scene.shotTimer = scene.shotCooldown
        scene.spawnShot(this.parent, this.velocity)
        this.stateMachine.transition('move')
    }
}