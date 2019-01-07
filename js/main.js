window.onload = function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext()

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousedown", startBall);
    //document.addEventListener("mousemove", updatePos);
    //canvas.addEventListener("mousedown", addToSet, true);
    //canvas.addEventListener("touchstart", addToSet, { passive: false, capture: true });
    document.getElementById("tIn").addEventListener("input", show);
    document.getElementById("dIn").addEventListener("input", show);
    document.getElementById("vIn").addEventListener("input", show);

    var animSet = new Set();
    var maxAge;
    var toneDuration;
    var volume;
    var xPos;
    var yPos;
    show();
    animateCircles();


    class flyingCircle {
        constructor(time, x, y, xSpeed, ySpeed) {
            this.omegaTime = time;
            this.time = time;
            this.x = x;
            this.y = y;
            this.xSpeed = xSpeed;
            this.ySpeed = ySpeed;
            this.radius = 20;
            this.colour = getRandomColour();
            this.maxAge = maxAge;
            this.toneDuration = toneDuration;
            this.volume = volume;
        }

        draw(time) {
            const age = time - this.time;
            const relAge = age / this.maxAge;

            if (relAge < 1) {
                this.moveDatCircle();

                ctx.fillStyle = this.colour;
                const fade = (1 - relAge);
                ctx.globalAlpha = fade * fade;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.fill();
                return true;
            }

            return false;
        }

        moveDatCircle() {
            const time = getTime();
            const age = time - this.omegaTime;

            this.x += this.xSpeed * age;
            this.y += this.ySpeed * age;

            if (this.x < this.radius && this.y < canvas.height / 2) {
                this.x = 2 * this.radius - this.x;
                this.xSpeed = -this.xSpeed;

                var tone = new Tone(261.63, this.volume, this.toneDuration);
                tone.play();
            } else if (this.x < this.radius && this.y > canvas.height / 2) {
                this.x = 2 * this.radius - this.x;
                this.xSpeed = -this.xSpeed;

                var tone = new Tone(523.25, this.volume, this.toneDuration);
                tone.play();
            } else if (this.x > canvas.width - this.radius && this.y < canvas.height / 2) {
                this.x = 2 * (canvas.width - this.radius) - this.x;
                this.xSpeed = -this.xSpeed;

                var tone = new Tone(349.23, this.volume, this.toneDuration);
                tone.play();
            } else if (this.x > canvas.width - this.radius && this.y > canvas.height / 2) {
                this.x = 2 * (canvas.width - this.radius) - this.x;
                this.xSpeed = -this.xSpeed;

                var tone = new Tone(392.00, this.volume, this.toneDuration);
                tone.play();
            }

            if (this.y < this.radius && this.x < canvas.width / 2) {
                this.y = 2 * this.radius - this.y;
                this.ySpeed = -this.ySpeed;

                var tone = new Tone(293.66, this.volume, this.toneDuration);
                tone.play();
            } else if (this.y < this.radius && this.x > canvas.width / 2) {
                this.y = 2 * this.radius - this.y;
                this.ySpeed = -this.ySpeed;

                var tone = new Tone(329.63, this.volume, this.toneDuration);
                tone.play();
            } else if (this.y > canvas.height - this.radius && this.x < canvas.width / 2) {
                this.y = 2 * (canvas.height - this.radius) - this.y;
                this.ySpeed = -this.ySpeed;

                var tone = new Tone(493.88, this.volume, this.toneDuration);
                tone.play();
            } else if (this.y > canvas.height - this.radius && this.x > canvas.width / 2) {
                this.y = 2 * (canvas.height - this.radius) - this.y;
                this.ySpeed = -this.ySpeed;

                var tone = new Tone(440.00, this.volume, this.toneDuration);
                tone.play();
            }

            this.omegaTime = time;
        }
    }

    function animateCircles() {
        const time = getTime();
        ctx.fillStyle = "#000000";
        ctx.globalAlpha = 0.2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#ffffff";
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        //ctx.stroke();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        const array = Array.from(animSet);
        for (let i = 0; i < array.length; i++) {
            const circle = array[i];
            const isAlive = circle.draw(time);

            if (!isAlive) {
                animSet.delete(circle);
            }
        }

        requestAnimationFrame(animateCircles);
    }

    // OLD addToSet() function with random speeds - DEPRECIATED
    /*function addToSet(event) {
        //event.preventDefault(); //to prevent default handling of touch events
        const time = getTime();
        const rect = event.target.getBoundingClientRect();
        var x;
        var y;
        if (event.type == "touchstart") {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        } else if (event.type == "mousedown") {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }
        const circle = new flyingCircle(time, x, y);
        animSet.add(circle);
    }*/

    function startBall(event) {
        const screen = event.target.getBoundingClientRect();
        var xStart = event.clientX - screen.left;
        var yStart = event.clientY - screen.top;


        function callUpdate() { updatePos(xStart, yStart, screen); }
        function calcDist() {
            const time = getTime();
            var xSpeed = xPos - screen.left - xStart;
            var ySpeed = yPos - screen.top - yStart;

            const circle = new flyingCircle(time, xStart, yStart, xSpeed, ySpeed);
            animSet.add(circle);
            canvas.removeEventListener("mousemove", callUpdate);
            canvas.removeEventListener("mouseup", calcDist);
            canvas.removeEventListener("mouseleave", calcDist);
        }

        canvas.addEventListener("mousemove", callUpdate);
        canvas.addEventListener("mouseup", calcDist);
        canvas.addEventListener("mouseleave", calcDist);
    }

    class Tone {
        constructor(frequency, volume, duration) {
            this.frequency = frequency;
            this.volume = volume;
            this.duration = duration;
        }

        play() {
            var oscillator = audioCtx.createOscillator();
            var gainNode = audioCtx.createGain();

            gainNode.gain.value = this.volume;
            oscillator.frequency.value = this.frequency;
            oscillator.type = "sine";

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();

            setTimeout(
                function () {
                    //Ramps out to remove clicking
                    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
                },
                this.duration
            );
        }
    }

    function show() {
        maxAge = document.getElementById("tIn").value;
        toneDuration = document.getElementById("dIn").value;
        volume = document.getElementById("vIn").value / 100;

        document.getElementById("tOut").innerHTML = maxAge + " s";
        document.getElementById("dOut").innerHTML = toneDuration + " ms";
        document.getElementById("vOut").innerHTML = volume;
    }

    function updatePos(xStart, yStart, screen) {
        xPos = event.pageX
        yPos = event.pageY
        //console.log(xPos + ", " + yPos);

        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xPos - screen.left, yPos - screen.top);
        ctx.stroke();
    }

    function getRandomSpeed() {
        return 1000 * Math.random();
    }
    function getRandomColour() {
        var r = Math.floor(255 * Math.random());
        var g = Math.floor(255 * Math.random());
        var b = Math.floor(255 * Math.random());
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    function getTime() {
        return 0.001 * (new Date().getTime());
    }

    function resizeCanvas() {
        var rect = canvas.parentNode.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        console.log(canvas.width + ", " + canvas.height);
    }
}