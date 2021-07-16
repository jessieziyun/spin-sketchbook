const W = window.innerWidth;
const H = window.innerHeight;
const r = W / 128;
const maxr = r * 8;
const num = 24;

let mic, fft;
let userStart = false;

var sketch = p => {

    p.setup = function () {
        p.getAudioContext().suspend();
        p.createCanvas(W, H);
        fft = new p5.FFT();
    };

    p.draw = () => {
        if (userStart == true) {
            p.background(242, 241, 241, 200);
            let spectrum = fft.analyze();
            p.fill(0);

            let vol = mic.getLevel();

            const gridspace = (H - r * 4) / num;
            for (let i = 0; i < num; i++) {
                for (let j = 0; j < num; j++) {
                    const xpos = i * gridspace + r;
                    const ypos = j * gridspace + r + maxr;
                    const distance = p.dist(xpos, ypos, W / 2, H / 2)
                    const radius = p.map(distance, 0, W / 2, maxr * vol + r, r);
                    p.ellipse(xpos, ypos, radius)
                }
            }
        }
    };

    document.getElementById("startButton").addEventListener('click', function () {
        document.getElementById("info").style.display = "none";
        document.getElementById("startButton").style.display = "none";
        document.getElementById("solid").style.display = "none";
        document.getElementById("info-button").style.display = "inline-block";
        userStart = true;
        mic = new p5.AudioIn();
        mic.start();
        fft.setInput(mic);
        p.getAudioContext().resume();
    });
};

var myp5 = new p5(sketch, 'canvas');