'use strict'

const HEIGHT = 100
const WIDTH = 1000
const SPARCITY = 100 // Higher means less islands
const MINIMUM_DISTANCE = 1
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
      magnitude: noise.perlin2(x, y), // and
      direction: noise.simplex2(x, y)
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
