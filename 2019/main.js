var game = new Phaser.Game(1000, 800, Phaser.CANVAS, 'gameDiv');
var background;
var player;
var cursors;
var bullets;
var bulletTime = 0;
var fireBullet;
var enemies;
var score = 0;
var scoreText;
var winText;


var mainState = {
    preload: function () {
        game.load.image('background', 'assets/schoolhouse.jpg');
        game.load.image('player', 'assets/player.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('enemy', 'assets/enemy.png');
    },

    create: function () {
        background = game.add.tileSprite(0, 0, 1000, 800, 'background');
        player = game.add.sprite(game.world.centerX, game.world.centerY + 300, 'player');
        game.physics.enable(player, Phaser.Physics.ARCADE);
        cursors = game.input.keyboard.createCursorKeys();
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        createEnemies();
        scoreText = game.add.text(0, 550, 'Score:', {
            font: '32px Arial',
            fill: '#fff'
        });
        winText = game.add.text(300, 200, '感谢您为广州的蓝天做出贡献', {
            font: '38px Arial',
            fill: '#fff'
        });

        creatorText = game.add.text(730, 730, '三七中队 贾乐琪制作', {
            font: '28px Arial',
            fill: '#fff'
        });
        winText.visible = false;

       
    },

    update: function () {
        game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);
        if (cursors.left.isDown) {
            player.body.velocity.x = -350;
        }
        if (cursors.right.isDown) {
            player.body.velocity.x = 350;
        }
        if (fireButton.isDown) {
            fireBullet();
        }
        scoreText.text = 'Score:' + score;

        if (score == 4000) {
            winText.visible = true;
            scoreText.visible = false;
        }

        
    }

};

function fireBullet() {
    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);
        if (bullet) {
            bullet.reset(player.x + 14, player.y);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }
}

function createEnemies() {
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 10; x++) {
            var enemy = enemies.create(x * 85, y * 100, 'enemy');
            enemy.anchor.setTo(0.5, 0.5)
        }
    }
    enemies.x = 50;
    enemies.y = 10;
    var tween = game.add.tween(enemies).to({
        x: 200
    }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    tween.onLoop.add(descend, this);
}

function descend() {
    enemies.y += 10;
}

function collisionHandler(bullet, enemy) {
    bullet.kill();
    enemy.kill();
    score += 100;
}

game.state.add('mainState', mainState);
game.state.start('mainState');