const W = window.innerWidth;
const H = window.innerHeight;
const radius = W / 16;

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

            for (i = 0; i < spectrum.length; i += 64) {
                p.ellipse(i / 64 * radius + radius / 2, p.map(spectrum[i], 0, 255, H - H / 8, H - H / 5), radius - 6);
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