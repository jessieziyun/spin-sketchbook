const W = window.innerWidth;
const H = window.innerHeight;
let mic, fft;
let userStart = false;

var sketch = p => {

    p.setup = function () {
        p.getAudioContext().suspend();
        p.createCanvas(W, H);
        
    };

    p.draw = () => {
        p.background(242, 241, 241, 200);
        let spectrum = fft.analyze();
        p.fill(0);

        for (i = 0; i < spectrum.length; i += 75) {
            p.ellipse(p.map(i + 45, 0, spectrum.length, 0, W - 20), p.map(spectrum[i], 0, 255, H - 50, H - 100), 25);
        }
    };

    document.getElementById("startButton").addEventListener('click', function () {
        document.getElementById("info").style.display = "none";
        document.getElementById("startButton").style.display = "none";
        document.getElementById("solid").style.display = "none";
        document.getElementById("info-button").style.display = "inline-block";
        userStart = true;
        p.getAudioContext().resume();
        mic = new p5.AudioIn();
        mic.start();
        fft = new p5.FFT();
        fft.setInput(mic);
    });
};

var myp5 = new p5(sketch, 'canvas');