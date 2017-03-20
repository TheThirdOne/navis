'use strict'

// Height and width in boat units
const HEIGHT = 300
const WIDTH = 1000
const SPARCITY = 100 // Higher means less islands
const MINIMUM_DISTANCE = 5
const MAX_LOAD_TIME = 100

class World {
  constructor() {
    this.height = HEIGHT
    this.width = WIDTH

    this.islands = []
    for(let _i = 0; _i < HEIGHT * WIDTH / SPARCITY; _i++) {
      this.islands.push(new Island(this))
    }

    this.structures = []
    for(let _i = 0; _i < HEIGHT * WIDTH / SPARCITY; _i++) {
      this.structures.push(new Structure(this))
    }
  }
  getWindVectorAt(x, y) {
    // Vector! That's me, because I commit crimes with both...
    return {
      magnitude: noise.perlin2(x/100, y/100), // and
      direction: noise.simplex2(x/100, y/100)*180
    }
  }
}

class Location {
  constructor(world, type, x = undefined, y = undefined) {
    this.type = type
    if(x == null || y == null) {
      var position = this.getOpenSpot(world, x, y)
      x = position.x
      y = position.y
    }
    this.x = x
    this.y = y
    this.r = 1
  }

  getOpenSpot(world, startTime = Date.now()) {
    var generationTime = Date.now() - startTime
    if(generationTime > MAX_LOAD_TIME) {
      console.warn(this.type + ' generation took ' + generationTime + ' milliseconds. The map may be too cluttered')
    }
    var x = Math.random() * WIDTH
    var y = Math.random() * HEIGHT
    var tooClose = world[this.type + 's'].some(i => {
      return Math.sqrt(Math.pow(i.x - x, 2) + Math.pow(i.y - y, 2)) < MINIMUM_DISTANCE
    })
    if (tooClose) {
      return this.getOpenSpot(world, startTime)
    } else {
      return {x, y}
    }
  }
}

class Island extends Location {
  constructor(world, x, y) {
    super(world, 'island', x, y)
  }
}

class Structure extends Location {
  constructor(world, x, y) {
    super(world, 'structure', x, y)
  }
}


function distance(a,b){
  let dx = Math.abs(a.x-b.x);
  if(dx > WIDTH/2){
    dx = WIDTH-dx;
  }
  return (a.y-b.y)*(a.y-b.y) + dx*dx;
}

function angle(a,b){
  let dx = a.x-b.x;
  if(dx > WIDTH/2){
    dx = WIDTH-dx;
  }else if(dx < -WIDTH/2){
    dx = -WIDTH-dx;
  }
  return Math.atan2(dx,a.y-b.y)
}
