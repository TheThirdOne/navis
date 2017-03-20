class Game {
  constructor(){
    console.log(this.loop)
    this.view = new View("demoCanvas", this.loop.bind(this));
    this.input = new Input([[38,"up"],[37,"left"],[39,"right"]]);
    this.world = new World();
    this.ship = new Ship();
    
  }
  loop(){
    let throttle = this.input.map.up?1:0, rudder = this.input.map.left?.1:(this.input.map.right?-.1:0);
    this.ship.update(rudder,throttle);
    this.view.render({f:throttle,r:rudder,world:this.world,ship:this.ship});
    requestAnimationFrame(this.loop.bind(this));
  }
}

class Ship {
  constructor(){
    this.x = 30;
    this.y = 50;
    this.rotation = 0; // 0 degrees off of north
  }
  
  update(turn,throttle){
    
    //TODO: more complex physics using the wind
    var maxSpeed = 1/60;
    
    this.y += Math.cos(this.rotation/180*Math.PI)*maxSpeed*throttle;
    this.x += Math.sin(this.rotation/180*Math.PI)*maxSpeed*throttle;
    
    this.rotation += turn;
  }
}

var game = new Game();