let l = 120;
let a;
let middleLine;
let count;
const W = window.innerWidth;
const H = window.innerHeight;

document.getElementById("startButton").addEventListener('click', function () {
    document.getElementById("info").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("solid").style.display = "none";
    document.getElementById("info-button").style.display = "inline-block";
});

var sketch =  p => {
    p.setup = () => {
        p.createCanvas(W, H);
        middleLine = new Middle(W / 2, H / 2);
    }

    p.draw = () => {

        p.background(242, 241, 241, 50);

        p.strokeWeight(20);
        p.stroke(0);
        p.strokeCap(p.SQUARE);

        p.push();
        p.translate(p.width / 2 - 50, p.height / 2);
        p.rotate(-p.PI / 2.5);
        p.line(-l, 0, l, 0);
        p.pop();

        p.push();
        p.translate(p.width / 2 + 50, p.height / 2);
        p.rotate(p.PI / 2.5);
        p.line(-l, 0, l, 0);
        p.pop();

        middleLine.update()
        middleLine.draw2();
    }

    function Middle(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.a = 0;
    }

    Middle.prototype.update = () => {
        this.a = - Math.atan2(p.mouseX - W / 2, p.mouseY - H / 2) - p.PI/2;

    }

    Middle.prototype.draw2 = () => {
        p.push();
        p.translate(W / 2, H / 2);
        p.rotate(this.a);
        p.line(-l, 0, l, 0);
        p.pop();
    }
}

var myp5 = new p5(sketch, 'canvas');