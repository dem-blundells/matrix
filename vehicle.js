function Vehicle(x,y) {
    this.pos = createVector(x,y);
    this.target = createVector(x,y);
    this.vel = createVector(0,0);//.random2D();
    this.acc = createVector();
    this.r = 8;
    this.maxspeed = 1;
    this.maxforce = 0;
}

Vehicle.prototype.behaviours = function(){
    var arrive = this.arrive(this.target);
    this.applyForce(arrive);
}

Vehicle.prototype.applyForce = function (f) {
    this.acc.add(f);
}

Vehicle.prototype.update = function() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

}

Vehicle.prototype.show = function() {
    stroke(0,255,70);
    strokeWeight(6);
    point(this.pos.x, this.pos.y);
}

Vehicle.prototype.arrive = function(target){
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxspeed;
    if (d<100){
        var speed = map(d, 0, 20, 0, this.maxspeed);
    }
    desired.setMag(speed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce)
    return steer
}

Vehicle.prototype.seek = function(target){
    var desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce)
    return steer
}