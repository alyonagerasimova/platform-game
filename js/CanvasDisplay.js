const otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.png";
const playerSprites = document.createElement("img");
playerSprites.src = "img/player.png";
const playerXOverlap = 4;

class CanvasDisplay {
    constructor(parent, level) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = Math.min(600, level.width * scale);
        this.canvas.height = Math.min(450, level.height * scale);
        parent.appendChild(this.canvas);
        this.cx = this.canvas.getContext("2d");

        this.level = level;
        this.animationTime = 0;
        this.flipPlayer = false;

        this.viewport = {
            left: 0,
            top: 0,
            width: this.canvas.width / scale,
            height: this.canvas.height / scale
        };

        this.drawFrame(0);
    }

    clear() {
        this.canvas.parentNode.removeChild(this.canvas);
    }

    drawFrame(step) {
        this.animationTime += step;

        this.updateViewport();
        this.clearDisplay();
        this.drawBackground();
        this.drawActors();
    }

    updateViewport() {
        const view = this.viewport, margin = view.width / 3;
        const player = this.level.player;
        const center = player.pos.plus(player.size.times(0.5));

        if (center.x < view.left + margin)
            view.left = Math.max(center.x - margin, 0);
        else if (center.x > view.left + view.width - margin)
            view.left = Math.min(center.x + margin - view.width,
                this.level.width - view.width);
        if (center.y < view.top + margin)
            view.top = Math.max(center.y - margin, 0);
        else if (center.y > view.top + view.height - margin)
            view.top = Math.min(center.y + margin - view.height,
                this.level.height - view.height);
    }

    clearDisplay() {
        if (this.level.status === "won")
            this.cx.fillStyle = "rgb(68, 191, 255)";
        else if (this.level.status === "lost")
            this.cx.fillStyle = "rgb(44, 136, 214)";
        else
            this.cx.fillStyle = "rgb(52, 166, 251)";
        this.cx.fillRect(0, 0,
            this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        const view = this.viewport;
        const xStart = Math.floor(view.left);
        const xEnd = Math.ceil(view.left + view.width);
        const yStart = Math.floor(view.top);
        const yEnd = Math.ceil(view.top + view.height);

        for (let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                const tile = this.level.grid[y][x];
                if (tile == null) continue;
                const screenX = (x - view.left) * scale;
                const screenY = (y - view.top) * scale;
                const tileX = tile === "lava" ? scale : 0;
                this.cx.drawImage(otherSprites,
                    tileX, 0, scale, scale,
                    screenX, screenY, scale, scale);
            }
        }
    }

    flipHorizontally(context, around) {
        context.translate(around, 0);
        context.scale(-1, 1);
        context.translate(-around, 0);
    }

    drawPlayer(x, y, width, height) {
        let sprite = 8, player = this.level.player;
        width += playerXOverlap * 2;
        x -= playerXOverlap;
        if (player.speed.x !== 0)
            this.flipPlayer = player.speed.x < 0;

        if (player.speed.y !== 0)
            sprite = 9;
        else if (player.speed.x !== 0)
            sprite = Math.floor(this.animationTime * 12) % 8;

        this.cx.save();
        if (this.flipPlayer)
            this.flipHorizontally(this.cx, x + width / 2);

        this.cx.drawImage(playerSprites,
            sprite * width, 0, width, height,
            x, y, width, height);

        this.cx.restore();
    }

    drawActors() {
        this.level.actors.forEach(function (actor) {
            const width = actor.size.x * scale;
            const height = actor.size.y * scale;
            const x = (actor.pos.x - this.viewport.left) * scale;
            const y = (actor.pos.y - this.viewport.top) * scale;
            if (actor.type === "player") {
                this.drawPlayer(x, y, width, height);
            } else {
                const tileX = (actor.type === "coin" ? 2 : 1) * scale;
                this.cx.drawImage(otherSprites,
                    tileX, 0, width, height,
                    x, y, width, height);
            }
        }, this);
    }
}