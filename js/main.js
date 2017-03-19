class Game {
  constructor(){
    console.log(this.loop)
    this.view = new View("demoCanvas", this.loop.bind(this));
    this.input = new Input([[38,"up"],[37,"left"],[39,"right"]]);
    this.world = new World();
    this.ship = new Ship();
    
  }
  loop(){
    this.view.render({f:1,r:.1,world:this.world,ship:this.ship});
    requestAnimationFrame(this.loop.bind(this));
  }
}

class Ship {
  constructor(){
    this.x = 30;
    this.y = 50;
    this.direction = 0; // 0 degrees off of north
  }
}

var game = new Game();