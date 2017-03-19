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
    // this.regions = createRegions()
    this.islands = []
    this.createIslands()
  }

  getRandomIsland(startTime=Date.now()) {
    var generationTime = Date.now() - startTime
    if(generationTime > MAX_LOAD_TIME) {
      console.warn('Island generation took ' + generationTime + ' milliseconds. This is too long.')
    }
    var x = Math.random() * WIDTH
    var y = Math.random() * HEIGHT
    var tooClose = this.islands.some(i => {
      return Math.sqrt(Math.pow(i.x - x, 2) + Math.pow(i.y - y, 2)) < MINIMUM_DISTANCE
    })
    if (tooClose) {
      return this.getRandomIsland(startTime)
    } else {
      return {x, y}
    }
  }

  createIslands() {
    for(let _i = 0; _i < HEIGHT * WIDTH / SPARCITY; _i++) {
      this.islands.push(this.getRandomIsland())
    }
  }

}
