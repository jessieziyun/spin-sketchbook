const W = window.innerWidth;
const H = window.innerHeight;

var sticks = function (p) { // p could be any variable name
    p.setup = function () {
        p.createCanvas(W, H / 2);
    };

    p.draw = function () {
        const l = 50;
        p.background(242, 241, 241);
        p.strokeWeight(7);
        p.stroke(0);
        p.strokeCap(p.SQUARE);

        p.push();
        p.translate(W / 2 - 40, H / 4);
        p.rotate(90);
        p.line(-l, 0, l, 0);
        p.pop();

        p.push();
        p.translate(W / 2 + 40, H / 4);
        p.rotate(-90);
        p.line(-l, 0, l, 0);
        p.pop();
    };
};
var myp5 = new p5(sticks, 'sticks');

var circles = function (p) { // p could be any variable name
    p.setup = function () {
        p.createCanvas(W, H / 2);
    };

    p.draw = function () {
        p.background(0);
        p.fill(242, 241, 241);
        p.ellipse(W / 2, H / 4, 75, 75);
    };
};
var myp5 = new p5(circles, 'circles');