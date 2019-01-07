window.onload = function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousedown", addToSet, true);
    canvas.addEventListener("touchstart", addToSet, { passive: false, capture: true });

    var animSet = new Set();
    const maxAge = 10;

    animateCircles();

    class flyingCircle {
        constructor(time, x, y) {
            this.omegaTime = time;
            this.time = time;
            this.x = x;
            this.y = y;
            this.xSpeed = getRandomSpeed();
            this.ySpeed = getRandomSpeed();
            this.radius = 20;
            this.colour = getRandomColour();
        }

        draw(time) {
            const age = time - this.time;
            const relAge = age / maxAge;

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

            if (this.x < this.radius) {
                this.x = 2 * this.radius - this.x;
                this.xSpeed = -this.xSpeed;
            } else if (this.x > canvas.width - this.radius) {
                this.x = 2 * (canvas.width - this.radius) - this.x;
                this.xSpeed = -this.xSpeed;
            }

            if (this.y < this.radius) {
                this.y = 2 * this.radius - this.y;
                this.ySpeed = -this.ySpeed;
            } else if (this.y > canvas.height - this.radius) {
                this.y = 2 * (canvas.height - this.radius) - this.y;
                this.ySpeed = -this.ySpeed;
            }

            this.omegaTime = time;
        }
    }

    function animateCircles() {
        const time = getTime();
        ctx.fillStyle = "#000000";
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#ffffff";
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();
        ctx.moveTo(0, canvas.height/2);
        ctx.lineTo(canvas.width, canvas.height/2);
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


    function addToSet(event) {
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