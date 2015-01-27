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