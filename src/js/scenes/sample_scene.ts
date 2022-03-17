import { Player } from "../props/player";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class SampleScene extends Phaser.Scene {

    private player: Player;
    private score: integer = 0;
    private score_label: Phaser.GameObjects.Text;
    private coin_good: Phaser.Physics.Arcade.Sprite & { body: Phaser.Physics.Arcade.Body };
    private coin_bad: Phaser.Physics.Arcade.Sprite & { body: Phaser.Physics.Arcade.Body };

    constructor() {
        super(sceneConfig);
    }

    public preload () {
        this.load.tilemapTiledJSON('level_01', 'assets/tilemaps/level_01.json');
        this.load.image('tiles', 'assets/spritesheets/tilesheet_complete.png');
        this.load.spritesheet('player', 'assets/spritesheets/player_walk.png', {
            frameWidth: 32,
            frameHeight: 32
        })
        this.load.spritesheet('coin_good', 'assets/spritesheets/coin_16x16.png', {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet('coin_bad', 'assets/spritesheets/coin_16x16-red.png', {
            frameWidth: 16,
            frameHeight: 16
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

        this.player = new Player(this, 30, 50, 'player', 0);
        this.player.setBounce(0.1);
        this.player.setGravityY(1000);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, ground);

        this.coin_good = this.physics.add.sprite(130, 80, 'coin_good')
        this.coin_bad = this.physics.add.sprite(352, 144, 'coin_bad')
        this.coin_good.name = 'good'
        this.coin_bad.name = 'bad'

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

        this.anims.create({
            key: 'spin_good',
            frames: this.anims.generateFrameNumbers('coin_good', {
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            }),
            frameRate: 18,
            repeat: -1
        })

        this.anims.create({
            key: 'spin_bad',
            frames: this.anims.generateFrameNumbers('coin_bad', {
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            }),
            frameRate: 18,
            repeat: -1
        })

        this.physics.add.collider(this.player, [this.coin_good, this.coin_bad], function (player, coin) {
            if (coin.name == 'bad') {
                this.score -= 1
            } else {
                this.score += 1
            }

            coin.destroy();
        });

        this.coin_good.play('spin_good', true);
        this.coin_bad.play('spin_bad', true);

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
