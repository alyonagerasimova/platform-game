// var simpleLevel = new Level(simpleLevelPlan);
// var display = new DOMDisplay(document.body, simpleLevel);

const arrowCodes = {37: "left", 38: "up", 39: "right"};

function trackKeys(codes) {
    const pressed = Object.create(null);

    function handler(event) {
        if (codes.hasOwnProperty(event.keyCode)) {
            const down = event.type === "keydown";
            pressed[codes[event.keyCode]] = down;
            event.preventDefault();
        }
    }

    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
}

function runAnimation(frameFunc) {
    let lastTime = null;

    function frame(time) {
        let stop = false;
        if (lastTime != null) {
            const timeStep = Math.min(time - lastTime, 100) / 1000;
            stop = frameFunc(timeStep) === false;
        }
        lastTime = time;
        if (!stop)
            requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

const arrows = trackKeys(arrowCodes);

function runLevel(level, Display, andThen) {
    const display = new Display(document.body, level);
    runAnimation(function (step) {
        level.animate(step, arrows);
        display.drawFrame(step);
        if (level.isFinished()) {
            display.clear();
            if (andThen)
                andThen(level.status);
            return false;
        }
    });
}

function runGame(plans, Display) {
    let countLife = 3;
    // const wrap = elt("div");
    // console.log(document.getElementsByClassName(".game"))
    // for (let i = 0; i < countLife; i++) {
    //     const rect = wrap.appendChild(elt("div", "heart "));
    // }
    // document.getElementsByTagName("table").appendChild(wrap);

    function startLevel(n) {
        runLevel(new Level(plans[n]), Display, function (status) {

            if (countLife === 0) {
                console.log("You lost...");
                countLife = 3;
                startLevel(0);
            } else if (status === "lost" && countLife > 0) {
                countLife--;
                startLevel(n);
            } else if (n < plans.length - 1 && countLife > 0) {
                startLevel(n + 1);
            } else
                console.log("You win!");

            console.log(countLife)
        });
    }

    startLevel(0);
}

// runGame(GAME_LEVELS, DOMDisplay);
runGame(GAME_LEVELS, CanvasDisplay);