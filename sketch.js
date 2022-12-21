let attractor
let a
let allPlanets
let allAttractors
let G = 1 
let R = 5000 //Radius Constant ( Handle in how much raidus planets will revolute)

function setup() {
  createCanvas(innerWidth, innerHeight);
  allPlanets = new Array(200).fill().map(()=>new Planet(random(innerWidth), random(innerHeight)))
  allAttractors = []
}

function draw() {
  background(12,50,55, 50);
  allAttractors.forEach((attractor)=>{
    allPlanets.forEach((planet)=>{
      attractor.attract(planet)
      planet.update()

      allAttractors.forEach((secAttractor)=>{
        if (attractor.visible && secAttractor!==attractor && secAttractor.visible) { 
          attractor.attractBlackHOle(secAttractor)
        }
      })

    })
  })

  if (!allAttractors.length) {
    allPlanets.forEach((planet)=>{
      planet.update()
    })
  }
}

function mousePressed(){
  let found = false
  allAttractors.forEach((attractor)=>{
    if (dist(attractor.position.x, attractor.position.y, mouseX, mouseY)<attractor.radius-20) {
      attractor.grabbed = true
      found = true
    }
  })
  if (!found) {
    addBlackHole(mouseX, mouseY)
  }
}
function mouseReleased(){
  allAttractors.forEach((attractor)=>{
    if (dist(attractor.position.x, attractor.position.y, mouseX, mouseY)<attractor.radius-20) {
      attractor.grabbed = false
    }
  })
}


function mouseDragged(){
  allAttractors.forEach((attractor)=>{
    if (attractor.grabbed && dist(attractor.position.x, attractor.position.y, mouseX, mouseY)<attractor.radius) {
      attractor.position.x = mouseX
      attractor.position.y = mouseY
    }
  })
} 


function addBlackHole(x, y){
  allAttractors.push(new BlackHole(x, y))
}

class BlackHole{
  constructor(x, y){
    this.position = createVector(x, y)
    this.mass = 60
    this.radius = 10  
    this.velocity = createVector(0, 0)
    this.visible = true
    this.grabbed = true
  }
  attract(planet){
    if (!this.visible) return
    let direction = p5.Vector.sub(this.position, planet.position)
    let distanceSq = (direction.magSq(), this.mass/200, 25000)
    let forceMg = (G * constrain(100*this.mass, 0, 1000) / distanceSq)
    direction.setMag(forceMg)
    planet.push(direction)
    if (dist(planet.position.x, planet.position.y, this.position.x, this.position.y)>R/this.radius) {
      planet.velocity.add(-planet.velocity.x*0.01, -planet.velocity.y*0.01)
    }
    this.show()
  }
  attractBlackHOle(Hole){
    if (dist(Hole.position.x, Hole.position.y, this.position.x, this.position.y) < this.radius/2) {
      Hole.position = this.position
      Hole.visible = false
      this.velocity = createVector(0, 0)
      Hole.velocity = createVector(0, 0)
      this.radius+=Hole.radius
      this.mass+=Hole.mass
    }
    else{
      let direction = p5.Vector.sub(this.position, Hole.position)
      let distanceSq = constrain(direction.magSq(), this.mass, 250000)
      let forceMg = (G * (this.mass) / distanceSq)/1000
      direction.setMag(forceMg)
      Hole.push(direction)
    }
  }
  show(){
    if (this.radius>200) {
      this.visible = false
    }
    fill(color(random(15), random(15), random(15), random(255)))
    circle(this.position.x, this.position.y, this.radius)
  }
  push(force){
    this.velocity.add(force.x , force.y )
    this.position.add(this.velocity)
  }
}
class Planet{
  constructor(x, y){
    this.position = createVector(x, y)
    this.mass = 10
    this.velocity = createVector(0.5, 0.5)
    this.radius = 3
  }
  show(){
    fill(color(255, 255, 255))
    circle(this.position.x, this.position.y, this.radius, 'black')
  }
  push(force){
    this.velocity.add(force)
  }
  update(){
    this.position.add(this.velocity)
    this.show()
  }
}

