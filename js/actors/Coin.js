const wobbleSpeed = 8, wobbleDist = 0.07;

class Coin {
    constructor(pos) {
        this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
        this.size = new Vector(0.6, 0.6);
        this.wobble = Math.random() * Math.PI * 2;
    }

    type = "coin";

    act(step) {
        this.wobble += step * wobbleSpeed;
        const wobblePos = Math.sin(this.wobble) * wobbleDist;
        this.pos = this.basePos.plus(new Vector(0, wobblePos));
    }
}