
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


        
        