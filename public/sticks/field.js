let u;
let l;
let a;
let mids = [];
let staticLines = [];
let x;
let y;
let count;
let noiseX = 0;
let noiseY = 0;
const W = window.innerWidth;
const H = window.innerHeight;

document.getElementById("startButton").addEventListener('click', function () {
    document.getElementById("info").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("solid").style.display = "none";
    document.getElementById("info-button").style.display = "inline-block";
});

var sketch = p => {
    p.setup = () => {
        p.createCanvas(W, H);
        u = 30;
        l = 15;
        let highCount = H / 36;
        let wideCount = W / 30;
        count = p.int(highCount * wideCount);

        const border = 50;
        
        let index = 0;
        for (let xc = 0; xc < wideCount; xc++) {
            for (let yc = 0; yc < highCount; yc++) {
                mids[index++] = new Middle(p.int(xc) * u, p.int(yc) * u + border);
            }
        }

        index = 0;
        for (let xc = 0; xc < wideCount; xc++) {
            for (let yc = 0; yc < highCount; yc++) {
                staticLines[index++] = new Static(p.int(xc) * u, p.int(yc) * u + border);
            }
        }

        noiseX = W / 2;
        noiseY = H / 2;
        p.strokeWeight(2);
        p.stroke(0);
        p.strokeCap(p.SQUARE);
    }

    p.draw = () => {

        noiseX += (p.noise(p.frameCount * 0.05) - 0.5) * 20;
        noiseY += (p.noise(p.frameCount * 0.05) - 0.5) * 20;

        if (noiseX > W) {
            noiseX = W;
        }
        if (noiseX < 0) {
            noiseX = 0;
        }
        if (noiseY > H) {
            noiseY = H;
        }
        if (noiseY < 0) {
            noiseY = 0;
        }
        p.background(242, 241, 241, 200);

        p.translate(15, 25);

        for (var i = 0; i < count; i++) {
            // console.log(mids)
            if (mids[i] !== undefined) {
                mids[i].update(mids[i].x, mids[i].y, p.mouseX, p.mouseY);
                mids[i].draw2(mids[i].x, mids[i].y);
                staticLines[i].draw2();
            }  
        }
    }

    function Middle(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.a = 0;
    }

    Middle.prototype.update = (tx, ty, nx, ny) => {
        this.a = p.atan2(nx - tx, ny - ty);
    }

    Middle.prototype.draw2 = (tx, ty) => {
        p.push();
        p.translate(tx + 10, ty);
        p.rotate(this.a);   
        p.line(-l, 0, l, 0);
        p.pop();
    }

    function Static(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
    
    Static.prototype.draw2 = function () {
        p.push();
        p.translate(this.x, this.y);
        p.rotate(-p.PI / 2.5);
        p.line(-l, 0, l, 0);
        p.pop();
        p.push();
        p.translate(this.x + 15, this.y);
        p.rotate(p.PI / 2.5);
        p.line(-l, 0, l, 0);
        p.pop();
    }
}

var myp5 = new p5(sketch, 'canvas');