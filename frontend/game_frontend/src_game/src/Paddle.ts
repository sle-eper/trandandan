export class Paddle {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    widthPaddle: number = 10;
    heightPaddle: number = 100;
    scroll: number = 0;
    speed: number = 3;
    color: string;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, color: string = '#0ff') {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.shadowColor = this.color;
        this.ctx.shadowBlur = 20;

        // Rounded corners effect in canvas
        const r = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + r, this.y);
        this.ctx.lineTo(this.x + this.widthPaddle - r, this.y);
        this.ctx.quadraticCurveTo(this.x + this.widthPaddle, this.y, this.x + this.widthPaddle, this.y + r);
        this.ctx.lineTo(this.x + this.widthPaddle, this.y + this.heightPaddle - r);
        this.ctx.quadraticCurveTo(this.x + this.widthPaddle, this.y + this.heightPaddle, this.x + this.widthPaddle - r, this.y + this.heightPaddle);
        this.ctx.lineTo(this.x + r, this.y + this.heightPaddle);
        this.ctx.quadraticCurveTo(this.x, this.y + this.heightPaddle, this.x, this.y + this.heightPaddle - r);
        this.ctx.lineTo(this.x, this.y + r);
        this.ctx.quadraticCurveTo(this.x, this.y, this.x + r, this.y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    update() {
        this.y += this.scroll;
        this.keepInBounds();
    }

    setY(y: number) {
        this.y = y;
        this.keepInBounds();
    }

    getY(): number {
        return this.y;
    }

    getX(): number {
        return this.x;
    }

    getHeight(): number {
        return this.heightPaddle;
    }

    getWidth(): number {
        return this.widthPaddle;
    }

    private keepInBounds() {
        if (this.y < 0) this.y = 0;
        if (this.y + this.heightPaddle > this.canvas.height) {
            this.y = this.canvas.height - this.heightPaddle;
        }
    }

    moveUp() { this.scroll = -this.speed; }
    moveDown() { this.scroll = this.speed; }
    stop() { this.scroll = 0; }
}
