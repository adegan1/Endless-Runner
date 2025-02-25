class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // load visual elements
        this.load.path = './assets/visual/'
        this.load.image('platform', 'platform.png')
        this.load.image('shot', 'shot.png')
        this.load.image('enemy', 'enemy.png')

        this.load.image('enemy_part', 'enemy_part.png')
        this.load.image('grass_particle', 'grass_particle.png')
        this.load.image('air_jump_particle', 'air_jump.png')

        this.load.image('score_bg', 'score_bg.png')

        this.load.spritesheet('player', 'player.png', {
            frameWidth: 24,
            frameHeight: 37
        })

        this.load.spritesheet('health', 'health.png', {
            frameWidth: 96,
            frameHeight: 32
        })

        // load audio
        this.load.path = './assets/sfx/'
        this.load.audio('jumpSFX', 'jump.wav', {volume: .1})
        this.load.audio('airJumpSFX', 'airJump.wav')
        this.load.audio('shootSFX', 'shoot.wav')
        this.load.audio('explosionSFX', 'explosion.wav')
        this.load.audio('hurtSFX', 'hurt.wav')
        this.load.audio('dieSFX', 'playerDie.wav')

        this.load.audio('runnerSong', 'music/runnerSong.wav')
        this.load.audio('newHighScoreSFX', 'music/newHighScore.wav')
    }

    create() {
        // health "animation"
        this.anims.create({
            key: 'healthAnim',
            frameRate: 0,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('health', {start: 0, end: 2 }),
        })

        // player animations
        this.anims.create({
            key: 'run',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7}),
        })
        this.anims.create({
            key: 'jump',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 8}),
        })
        this.anims.create({
            key: 'fall',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 9}),
        })

        // enter play scene
        this.scene.start('playScene')
    }
}