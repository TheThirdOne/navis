var stage = new createjs.Stage("demoCanvas");
//Create a Shape DisplayObject.
var radar = new createjs.Shape();
radar.graphics.setStrokeStyle(6).beginStroke("#00AA00").arc(0, 0, 100, 0, Math.PI/2, false);
radar.graphics.setStrokeStyle(2).beginStroke("#00AA00").arc(0, 0, 100, -Math.PI/2, -Math.PI/4, false);
radar.x = radar.y = 200;
//stage.addChild(radar);

stage.update();

function loadAll(srcs,onload){
  var out;
  var i = 0;
  var func = function(){
    i++;
    if(i == srcs.length){
      onload(out);
    }
  }
  out = srcs.map(src=>{var img = new Image(); img.onload = func; img.src = src; return img;})
}

loadAll(["assets/sea.jpg","assets/ship.png", "assets/compass_back.png", "assets/compass_needle.png","assets/wind.png"],onload);
var game = {};

function onload(arr){
  // Add sea background
  var back = new createjs.Shape();
  back.cX = back.regX = stage.canvas.width;
  back.cY = back.regY = stage.canvas.width;
  back.x = stage.canvas.width/2;back.y = stage.canvas.height/2;
  back.tileX = 255;
  back.tileY = 256;
  back.graphics.beginBitmapFill(arr[0],'repeat').rect(0,0,stage.canvas.width*2,stage.canvas.width*2);
  stage.addChild(back);

  // Add Ship
  var ship = new createjs.Bitmap(arr[1]);
  ship.regX = 150;
  ship.regY = 150;
  ship.x = stage.canvas.width/2;
  ship.y = stage.canvas.height/2;
  stage.addChild(ship);

  var compass = new createjs.Bitmap(arr[2]);
  compass.regX = 150;
  compass.regY = 150;
  compass.scaleX = .5;
  compass.scaleY = .5;
  compass.x = stage.canvas.width-100;
  compass.y = stage.canvas.height/2;
  stage.addChild(compass);

  var needle = new createjs.Bitmap(arr[3]);
  needle.regX = 150;
  needle.regY = 150;
  needle.scaleX = .4;
  needle.scaleY = .4;
  needle.x = stage.canvas.width-100;
  needle.y = stage.canvas.height/2;
  stage.addChild(needle);

  var wind = new createjs.Bitmap(arr[4]);
  wind.regX = 150;
  wind.regY = 150;
  wind.scaleX = .4;
  wind.scaleY = .4;
  wind.x = 100;
  wind.y = stage.canvas.height/4*3;
  stage.addChild(wind);

  var world = new World()

  stage.update();
  game.entities = {back,ship,compass,needle,wind,world};
  requestAnimationFrame(loop);
}

var f=0,r=0;

function loop(){
  moveWater(r,f);
  // TODO: This is on you Ben
  var shipX = shipY = 0
  game.entities.wind.rotation = getWindVectorAt(shipX, shipY).direction+game.entities.back.rotation
  stage.update();
  requestAnimationFrame(loop);
}

function moveWater(rotation,forward){
  // Move forward
  game.entities.back.regX -= Math.sin(game.entities.back.rotation/180*Math.PI)*forward;
  game.entities.back.regY -= Math.cos(game.entities.back.rotation/180*Math.PI)*forward;

  // and rotate
  game.entities.needle.rotation += rotation;
  game.entities.back.rotation+=rotation;

  // Then snap back if needed
  game.entities.back.regX -= Math.round((game.entities.back.regX-game.entities.back.cX)/game.entities.back.tileX)*game.entities.back.tileX;
  game.entities.back.regY -= Math.round((game.entities.back.regY-game.entities.back.cY)/game.entities.back.tileY)*game.entities.back.tileY;
}

function getWindVectorAt(x, y) {
  // Vector! That's me, because I commit crimes with both...
  return {
    magnitude: noise.perlin2(x, y), // and
    direction: noise.simplex2(x, y)
  }
}

document.onkeydown = function(e){
  if(e.keyCode == 38){
    f = 1;
  }else if(e.keyCode == 37){
    r = 0.1;
  }else if(e.keyCode == 39){
    r = -0.1;
  }
}

document.onkeyup = function(e){
  if(e.keyCode == 38){
    f = 0;
  }else if(e.keyCode == 37){
    r = 0;
  }else if(e.keyCode == 39){
    r = 0;
  }
}
