function loadAll(srcs,onload){
  var out;
  var i = 0;
  var func = function(){
    i++;
    if(i == srcs.length){
      onload(out);
    }
  };
  out = srcs.map(src=>{var img = new Image(); img.onload = func; img.src = src; return img;});
}

class View {
  constructor(canvasID,then) {
    this.stage = new createjs.Stage("demoCanvas");
    loadAll(["assets/sea.jpg","assets/ship.png", "assets/compass_back.png", "assets/compass_needle.png","assets/wind.png"],this.onLoad.bind(this,then));
  }
  
  // Sets up the stage
  onLoad(then,arr){
    var back = new createjs.Shape();
    back.cX = back.regX = this.stage.canvas.width;
    back.cY = back.regY = this.stage.canvas.width;
    back.x = this.stage.canvas.width/2;back.y = this.stage.canvas.height/2;
    back.tileX = 255;
    back.tileY = 256;
    back.graphics.beginBitmapFill(arr[0],'repeat').rect(0,0,this.stage.canvas.width*2,this.stage.canvas.width*2);
    this.stage.addChild(back);
  
    // Add Ship
    var ship = new createjs.Bitmap(arr[1]);
    ship.regX = 150;
    ship.regY = 150;
    ship.x = this.stage.canvas.width/2;
    ship.y = this.stage.canvas.height/2;
    this.stage.addChild(ship);
  
    var compass = new createjs.Bitmap(arr[2]);
    compass.regX = 150;
    compass.regY = 150;
    compass.scaleX = .5;
    compass.scaleY = .5;
    compass.x = this.stage.canvas.width-100;
    compass.y = this.stage.canvas.height/2;
    this.stage.addChild(compass);
  
    var needle = new createjs.Bitmap(arr[3]);
    needle.regX = 150;
    needle.regY = 150;
    needle.scaleX = .4;
    needle.scaleY = .4;
    needle.x = this.stage.canvas.width-100;
    needle.y = this.stage.canvas.height/2;
    this.stage.addChild(needle);
  
    var wind = new createjs.Bitmap(arr[4]);
    wind.regX = 150;
    wind.regY = 150;
    wind.scaleX = .4;
    wind.scaleY = .4;
    wind.x = 100;
    wind.y = this.stage.canvas.height/4*3;
    this.stage.addChild(wind);
  
    this.entities = {back,ship,compass,needle,wind};
    
    then();
  }
  
  render(gameState){
    this.moveWater(gameState.r,gameState.f);
    this.entities.wind.rotation = gameState.world.getWindVectorAt(gameState.ship.x, gameState.ship.y).direction-gameState.ship.rotation;
    this.entities.needle.rotation = -gameState.ship.rotation;
    this.stage.update();
  }
  
  moveWater(rotation,forward){
    // Move forward
    this.entities.back.regX -= Math.sin(this.entities.back.rotation/180*Math.PI)*forward;
    this.entities.back.regY -= Math.cos(this.entities.back.rotation/180*Math.PI)*forward;

    // and rotate
    this.entities.needle.rotation += rotation;
    this.entities.back.rotation+=rotation;
  
    // Then snap back if needed
    this.entities.back.regX -= Math.round((this.entities.back.regX-this.entities.back.cX)/this.entities.back.tileX)*this.entities.back.tileX;
    this.entities.back.regY -= Math.round((this.entities.back.regY-this.entities.back.cY)/this.entities.back.tileY)*this.entities.back.tileY;
  }
  
}


class Input {
  constructor(mappings=[]) {
    let map = {};
    document.onkeydown = function(e){
      for(let keyMap of mappings){
        if(e.keyCode == keyMap[0]){
          map[keyMap[1]] = true;
        }
      }
    };
    document.onkeyup = function(e){
      for(let keyMap of mappings){
        if(e.keyCode == keyMap[0]){
          map[keyMap[1]] = false;
        }
      }
    };
    this.map = map;
  }
}
