const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class SampleScene extends Phaser.Scene {

    private player: Phaser.Physics.Arcade.Sprite & { body: Phaser.Physics.Arcade.Body };

    constructor() {
        super(sceneConfig);
    }

    public preload () {
        this.load.tilemapTiledJSON('level_01', 'assets/tilemaps/level_01.json');
        this.load.image('tiles', 'assets/tilesets/tilesheet_complete.png');
        this.load.spritesheet('player', 'assets/tilesets/player_walk.png', {
            frameWidth: 32,
            frameHeight: 32
        })
    }

    public create() {
        const map = this.make.tilemap({ key: 'level_01' })
        const tiles = map.addTilesetImage('kenney', 'tiles')

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        map.createLayer(0, tiles, 0, 0)
        map.createLayer(1, tiles, 0, 0)
        map.createLayer(2, tiles, 0, 0)
        const ground = map.createLayer(3, tiles, 0, 0)
        ground.setCollisionByExclusion([-1], true);

        map.createLayer(4, tiles, 0, 0)

        this.player = this.physics.add.sprite(30, 50, 'player')
        this.player.setBounce(0.1);
        this.player.setGravityY(1000);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, ground);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [1]
            }),
            frameRate: 8,
            repeat: 0
        })

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [0, 1, 2, 1]
            }),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [2]
            }),
            frameRate: 8,
            repeat: 0
        })

    }

    public update() {
        const user_input = this.input.keyboard.createCursorKeys();

        if (user_input.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.flipX = true;
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (user_input.right.isDown) {
            this.player.setVelocityX(200);
            this.player.flipX = false;
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.onFloor()) {
                this.player.play('idle', true);
            }
        }

        if ((user_input.space.isDown || user_input.up.isDown) && this.player.body.onFloor()) {
            this.player.setVelocityY(-500);
            this.player.play('jump', true);
        }
    }
}
