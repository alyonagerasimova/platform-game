const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

class Player {
    type = "player";

    constructor(pos) {
        this.pos = pos.plus(new Vector(0, -0.5));
        this.size = new Vector(0.8, 1.5);
        this.speed = new Vector(0, 0);
    }

    moveX(step, level, keys) {
        this.speed.x = 0;
        if (keys.left) this.speed.x -= playerXSpeed;
        if (keys.right) this.speed.x += playerXSpeed;

        const motion = new Vector(this.speed.x * step, 0);
        const newPos = this.pos.plus(motion);
        const obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle)
            level.playerTouched(obstacle);
        else
            this.pos = newPos;
    }

    moveY(step, level, keys) {
        this.speed.y += step * gravity;
        const motion = new Vector(0, this.speed.y * step);
        const newPos = this.pos.plus(motion);
        const obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle) {
            level.playerTouched(obstacle);
            if (keys.up && this.speed.y > 0)
                this.speed.y = -jumpSpeed;
            else
                this.speed.y = 0;
        } else {
            this.pos = newPos;
        }
    }

    act(step, level, keys) {
        this.moveX(step, level, keys);
        this.moveY(step, level, keys);

        const otherActor = level.actorAt(this);
        if (otherActor)
            level.playerTouched(otherActor.type, otherActor);

        if (level.status === "lost") {
            this.pos.y += step;
            this.size.y -= step;
        }
    }
}
