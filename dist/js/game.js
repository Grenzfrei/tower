(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(1280, 760, Phaser.AUTO, 'towertest');
      
      // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');    
};
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],2:[function(require,module,exports){
// Random Text Generator Super Class
var TextGen = (function () {
    // private static
    var nextId = 1;
    
    // constructor
    var cls = function (train_file) {
        // private
        var id = nextId++;
        var sg = new ROT.StringGenerator({words:true});
        
        var r = new XMLHttpRequest();
        r.open("get", "assets/text/"+train_file, true);
        r.send();

        r.onreadystatechange = function() {
            if (r.readyState != 4) { return; }

            var lines = r.responseText.split(" - ");
            while (lines.length) { 
                var line = lines.pop().trim();
                if (!line) { continue; }
                sg.observe(line); 
            }
        } 

        // public (this instance only)
        this.get_id = function () { return id; };
        this.get_sg = function () { return sg; };
    };

    // public static
    cls.get_nextId = function () {return nextId;};

    // public (shared across instances)
    cls.prototype = {
        make_text: function () { return this.get_sg().generate();}
    };

    return cls;
})();


// Random Name Generator
var NameGen = function(){};
NameGen.prototype = new TextGen("tolkien.txt");


exports.NameGen = function () {
  return new NameGen();
};
    
},{}],3:[function(require,module,exports){

// Random Map Generator Super Class
var Map = function(game, key, tileWidth, tileHeight, width, height) { 
    
// ** VARIABLES **//
    //var tilesList = [];
    var foeProb = 10;
    var foeMax = width*height/1000 * foeProb;
    var treasProb = 4;
    var treasMax = width*height/1000 * treasProb;
    
    //  Creates a blank tilemap
    Phaser.Tilemap.call(this, game, key, tileWidth, tileHeight, width, height);
  
    //  Add a Tileset image to the map
    this.addTilesetImage('dungeon');

//** LAYERS **//
    var ground = this.create('ground', width, height, tileWidth, tileHeight); // This is layer index '0'
    ground.resizeWorld();
    
    // player should go here at layer index 2

    //var buildings = this.createLayer('buildings', width, height, tileWidth, tileHeight); // layer index 3
    //this.setCollisionByExclusion([], true, buildings);

    //var trees = this.createLayer('trees', width, height, tileWidth, tileHeight); // etc.
    
    
//** GENERATE MAP **//
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // create rot.js map data 
        //ROT.RNG.setSeed(1234);
        var map = new ROT.Map.Uniform(width, height);
        map.create();
        
    //*** RENDER MAP ***//
        foeNum = 0; treasNum = 0;
        for (var x = 0; x < map._map.length; x++ ){
            for (var y = 0; y < map._map[x].length; y++ ){

                switch(map._map[x][y]){ 
                    case 0: 
                        // make tile 
                        this.putTile(33, x, y, ground);
                        //var tile = mapLayer.create(x*s, y*s, 'tiles');
                        // decide if enemy
                        if(_.random(100) < foeProb && foeNum < foeMax){
                            //var tile = mapLayer.create(x*s, y*s, 'enemy');
                            //tMap.putTile(44, x, y, mapLayer);
                            var foe = game.add.sprite(x*tileWidth, y*tileWidth, 'enemy');
                            game.world.addAt(foe, 5);
                            foeNum++;
                            console.log(foeNum);
                        }
                        // decide if treasure
                        if(_.random(100) < treasProb && treasNum < treasMax){
                            //var tile = itemLayer.create(x*s, y*s, 'treasure');
                            //tMap.putTile(46, x, y, mapLayer);
                            var chest = game.add.sprite(x*tileWidth, y*tileWidth, 'chest');
                            game.world.addAt(chest, 6);
                            treasNum++;
                        }
                        break;
                    case 1:
                        // is wall?
                        if(!map._isWallCallback(x-1,y)||!map._isWallCallback(x,y-1)||!map._isWallCallback(x+1,y)||!map._isWallCallback(x,y+1)||!map._isWallCallback(x-1,y-1)||!map._isWallCallback(x+1,y+1)||!map._isWallCallback(x+1,y-1)||!map._isWallCallback(x-1,y+1)){
                            // make tile 
                            this.putTile(9, x, y, ground);
                        }
                        else{    
                            // make tile 
                            this.putTile(29, x, y, ground);
                        }
                        break;
                    default: ;
                }
            }
        }       
        
        this.setCollision(9);
        //this.walls = this.createLayer(0);
        //  Un-comment this on to see the collision tiles
        //this.walls.debug = true;
    }

};

Map.prototype = Object.create(Phaser.Tilemap.prototype); 
Map.prototype.constructor = Map;
Map.prototype.render = function(round, walls){

}

// export to require
module.exports = Map;



                /*
                //cycle rot rooms data
                var rooms = map.getRooms();
                for (var i=0; i<rooms.length; i++) {
                    var room = rooms[i];
                    console.log("Room #%s: [%s, %s] => [%s, %s]".format(
                        (i+1),room.getLeft(), room.getTop(),room.getRight(), room.getBottom()
                    ));
                    
                    // Raumtiles in Array eintragen
                    for (var y = room.getTop(); y <= room.getBottom(); y++ ){
                        for (var x = room.getLeft(); x <= room.getRight(); x++ ){
                            tilesList[x][y] = 1;
                        }
                    }
                    
                   //console.log(room.getDoors());
                }

                //cycle rot corridors data
                var corridors = map.getCorridors();
                for (var i=0; i<corridors.length; i++) {
                    var corridor = corridors[i];
                    
                    // Korridortiles in Array eintragen
                    if(corridor._startX==corridor._endX){ // horizontal
                        var x = corridor._startX;
                        if(corridor._startY<corridor._endY){ // right
                            for (var y = corridor._startY; y<=corridor._endY; y++){
                                tilesList[x][y] = 10;
                            }
                        }else{ // left
                            for (var y = corridor._startY; y>=corridor._endY; y-- ){
                                tilesList[x][y] = 10;
                            }
                        }
                    }
                    else{ // vertical
                        var y = corridor._startY;
                        if(corridor._startX<corridor._endX){ // down
                            for (var x = corridor._startX; x<=corridor._endX; x++){
                                tilesList[x][y] = 10;
                            }
                        }else{ // up
                            for (var x = corridor._startX; x>=corridor._endX; x-- ){
                                tilesList[x][y] = 10;
                            }
                        }
                    }
                }
 
                var compArray = map._map;
                // save y coordinates
                for(var i = 0; i < compArray.length; i++){
                    compArray[i] = _.map(compArray[i], function(num, key){ 
                        return num>0 ? key : num;
                    });
                    // filter empty values
                    compArray[i] = _.compact(compArray[i]);
                }
                // save start of map in array
                var mapStart = 0;
                while(compArray[mapStart].length==0){mapStart++;}
                // filter empty colums
                compArray = _.filter(compArray, function(list){ return list.length>0; });
                console.log(compArray);
                // find empty place
                
                console.log(compArray[1][_.random(compArray[1].length)]);
                //console.log(random(compArray.length),random(arrayYlength));
                */


        
        
},{}],4:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
    
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;
},{}],5:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'sword');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Enter the Tower!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to generate map', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],7:[function(require,module,exports){
'use strict';

//** Modules **//
var nameGen = require('../modules/helper').NameGen();
var MapGen = require('../modules/map');

//** VARIABLES **//
var cursors;
var player;
var map;
var walls;

var w = 40;
var h = 24;
var s = 32;


//** Play **//
function Play() {}
Play.prototype = {
    
    create: function () {
         // initiate game physics
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
    //*** MAP ***/
        map = new MapGen(this.game, null, s, s, w, h);
        //  scale it
        //mapLayer.scale.set(0.5, 0.5);  
        //this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
        console.log(map.walls);
        
    //*** PLAYER ***/
        // create cursor input
        cursors = this.input.keyboard.createCursorKeys();
        // add player sprite
        player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.scale.set(0.9,0.9);
        //playLayer.add(player);
        this.game.world.addAt(player, 6); 
        this.game.physics.arcade.enable(player);
        this.game.camera.follow(player);

    //*** UI ***/
        var uiLayer = this.game.add.group();
        uiLayer.z = 10;
        uiLayer.fixedToCamera = true;
        //  displays graphic on-screen and assign it to a variable
        var image = uiLayer.create(1000, 50, 'tile');
        //  Enables all kind of input actions on this image (click, etc)
        image.inputEnabled = true;
        image.events.onInputDown.add(restart, this);
        // add text to grahic
        var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: image.width, align: "center" };
        var text = new Phaser.Text(this.game, 0, 0, "Restart", style);
        uiLayer.add(text);
        text.anchor.set(0.5);
        text.x = Math.floor(image.x + image.width / 2);
        text.y = Math.floor(image.y + image.height / 2);
        
        function restart(){
            console.log(nameGen.make_text());
            
            // reload state
            this.state.start(this.state.current);
            
            //localStorage.setItem('gameStorage', JSON.stringify(obj));
            //var obj = JSON.parse(localStorage.getItem('gameStorage'));
        }
    },
    update: function() {

        this.game.physics.arcade.collide(player, map.walls);
        
        player.body.velocity.set(0);

        if (cursors.up.isDown)
        {
             player.body.velocity.y = -150;
        }
        else if (cursors.down.isDown)
        {
            player.body.velocity.y = 150;
        }

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -150;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 150;
        }

    },
    clickListener: function() {
      this.game.state.start('gameover');
    },
    render: function() {
        //this.debug.cameraInfo(this.camera, 32, 32);
        //this.debug.spriteCoords(player, 32, 500);
    }
  };
  
  module.exports = Play;
},{"../modules/helper":2,"../modules/map":3}],8:[function(require,module,exports){

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

},{}]},{},[1])