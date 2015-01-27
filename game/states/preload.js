
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('sword', 'assets/sword.gif');
    this.load.image('tile', 'assets/tile.bmp');
    this.load.image('dungeon', 'assets/dungeon.png');
    this.load.spritesheet('tiles', 'assets/dungeon.png', 50, 50, 2);
    this.load.image('enemy','assets/enemy.png');
    this.load.image('chest','assets/chest.gif');
    this.load.image('player','assets/dude.png');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
