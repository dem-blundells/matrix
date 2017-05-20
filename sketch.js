var fomt;
var title;
var streams = [];
var vehicles = [];
var fadeInterval = 1.6;
var symbolSize = 20;
var titlesize = window.innerHeight/6;
var state = 0;

function preload(){
    font = loadFont('avenir.otf')
}

function setup() {
    createCanvas(
        window.innerWidth,
        window.innerHeight
    );
    frameRate(30);
    background(0);

    var x = 0;
    for (var i = 0; i <= width / symbolSize; i++) {
        var stream = new Stream();
        stream.generateSymbols(x, random(-2000, 0));
        streams.push(stream);
        x += symbolSize
    }
    txtln1 = new Title(100, (2/7)*window.innerHeight, 'Phoenix');
    txtln2 = new Title(200, (1/2)*window.innerHeight, 'Society');
    txtln3 = new Title(300, (5/7)*window.innerHeight, 'Cryptography');
    textFont('Consolas');
    textSize(symbolSize);
}

function draw() {
    background(0, 150);
    streams.forEach(function(stream) {
        stream.render();
    });
    vehicles.forEach(function(vehicle) {
        vehicle.behaviours();
        vehicle.update();
        vehicle.show();
    });
}

function Title(x, y, mytext){
    this.x = x;
    this.y = y;
    this.mytext = mytext;
    textSize(titlesize);
    var pts = font.textToPoints(this.mytext,this.x,this.y);

    for (var i = 0; i < pts.length; i++) {
        var pt = pts[i];
        var vehicle = new Vehicle(pt.x,pt.y);
        vehicles.push(vehicle);
    }

    this.render = function() {
        for (var i = 0; i < pts.length; i++) {
            var pt = pts[i];
            stroke(0,255,70);
            strokeWeight(6);
            point(pt.x, pt.y);
        }
    }
}

function Symbol(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.value;

    this.speed = speed;
    this.first = first;
    this.opacity = opacity;

    this.switchInterval = round(random(2, 25));

    this.setToRandomSymbol = function() {
        var charType = round(random(0, 5));
        if (frameCount % this.switchInterval == 0) {
            if (charType > 1) {
                // set it to Katakana
                this.value = String.fromCharCode(
                    0x30A0 + round(random(0, 96))
                );
            } else {
                // set it to numeric
                this.value = round(random(0,9));
            }
        }
    }

    this.rain = function() {
        this.y = (this.y >= height) ? 0 : this.y += this.speed;
    }

}

function Stream() {
    this.symbols = [];
    this.totalSymbols = round(random(5, 35));
    this.speed = random(5, 22);

    this.generateSymbols = function(x, y) {
        var opacity = 170;
        var first = round(random(0, 4)) == 1;
        for (var i =0; i <= this.totalSymbols; i++) {
            symbol = new Symbol(
                x,
                y,
                this.speed,
                first,
                opacity
            );
            symbol.setToRandomSymbol();
            this.symbols.push(symbol);
            opacity -= (255 / this.totalSymbols) / fadeInterval;
            y -= symbolSize;
            first = false;
        }
    }

    this.render = function() {
        textFont('Consolas');
        textSize(symbolSize);
        strokeWeight(0);
        this.symbols.forEach(function(symbol) {
            if (symbol.first) {
                fill(140, 255, 170, symbol.opacity);
            } else {
                fill(0, 255, 70, symbol.opacity);
            }
            text(symbol.value, symbol.x, symbol.y);
            symbol.rain();
            symbol.setToRandomSymbol();
        });
    }
}

function mousePressed(){
    if (state === 0) {
        vehicles.forEach(function(vehicle) {
            vehicle.vel = createVector(random(-0.3, 0.3), random(-0.3, 0.3));
            vehicle.maxforce = 0;
        });
        state = 1;
    } else {
        vehicles.forEach(function(vehicle) {
            vehicle.maxforce = 2;
        });
        state = 0;
    }
}