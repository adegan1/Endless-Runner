class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {

    }

    create() {


        // enter load scene
        this.scene.start('loadScene')
    }
}