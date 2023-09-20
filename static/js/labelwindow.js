class LabelBox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(originX, originY) {
        ctx.strokeRect(this.x + originX, this.y + originY, this.w, this.h);
    }
}


class LabelWindow {
    constructor() {
        this.active_image = null;
        this.canvas_width = canvas.width;
        this.canvas_height = canvas.height;
        this.cursorX = null;
        this.cursorY = null;
        this.mouse_down = false;

        this.startX = null;
        this.startY = null;

        this.label_boxes = [];

        this.originX = 0;
        this.originY = 0;
        
        window.addEventListener("resize", () => {
            this.resizeCanvas()
        });
        eventhandler.connect("sidebar-resize", () => {
            this.resizeCanvas();
        });
        this.resizeCanvas();

        canvas.addEventListener("mousemove", (event) => {
            let bounds = canvas.getBoundingClientRect();

            this.cursorX = event.clientX - bounds.left;
            this.cursorY = event.clientY - bounds.top;

            this.draw();

            if (this.mouse_down) {
                let startX = Math.min(this.startX, this.cursorX);
                let startY = Math.min(this.startY, this.cursorY);
                let width = Math.abs(this.startX - this.cursorX);
                let height = Math.abs(this.startY - this.cursorY);
                ctx.strokeRect(startX, startY, width, height);
            }
        });

        canvas.addEventListener("mousedown", (event) => {
            if (!this.mouse_down) {
                this.mouse_down = true;
                this.startX = this.cursorX;
                this.startY = this.cursorY;
            }
        });

        document.addEventListener("mouseup", (event) => {
            if (this.mouse_down) {
                this.mouse_down = false;

                let startX = Math.min(this.startX, this.cursorX);
                let startY = Math.min(this.startY, this.cursorY);
                let width = Math.abs(this.startX - this.cursorX);
                let height = Math.abs(this.startY - this.cursorY);
                this.label_boxes.push(new LabelBox(startX - this.originX, startY - this.originY, width, height));
            }
        });
    }

    resizeCanvas() {
        canvas.width = window.innerWidth - sidebar_border_position;
        canvas.height = window.innerHeight;
        console.log(canvas.width, canvas.height);
        this.canvas_width = canvas.width;
        this.canvas_height = canvas.height;

    }

    activate_image(imageElement) {
        this.active_image = imageElement;

        this.originX = (this.canvas_width - this.active_image.image.width) * 0.5;
        this.originY = (this.canvas_height - this.active_image.image.height) * 0.5;

        this.draw();
    }

    draw() {
        ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);

        ctx.drawImage(this.active_image.image, this.originX, this.originY);

        this.label_boxes.forEach(rect => {
            rect.draw(this.originX, this.originY);
        });
    }


}