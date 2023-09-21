import { eventhandler } from "./labelix.js";

export class LabelBox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(originX, originY, ctx) {
        ctx.strokeRect(this.x + originX, this.y + originY, this.w, this.h);
    }
}


export class LabelWindow {
    constructor(ui) {
        this.ui = ui;

        this.active_image = null;
        this.canvas_width = this.ui.canvas.width;
        this.canvas_height = this.ui.canvas.height;
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

        eventhandler.connect("image_activated", (imageElement) => {
            this.init();
            this.activate_image(imageElement);
        });
    }

    init() {
        this.ui.canvas.addEventListener("mousemove", (event) => {
            let bounds = this.ui.canvas.getBoundingClientRect();

            this.cursorX = event.clientX - bounds.left;
            this.cursorY = event.clientY - bounds.top;

            this.draw();

            if (this.mouse_down) {
                let startX = Math.min(this.startX, this.cursorX);
                let startY = Math.min(this.startY, this.cursorY);
                let width = Math.abs(this.startX - this.cursorX);
                let height = Math.abs(this.startY - this.cursorY);
                this.ui.ctx.strokeRect(startX, startY, width, height);
            }
        });

        this.ui.canvas.addEventListener("mousedown", (event) => {
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
        this.ui.canvas.width = window.innerWidth - this.ui.sidebar_border_position;
        this.ui.canvas.height = window.innerHeight;

        this.canvas_width = this.ui.canvas.width;
        this.canvas_height = this.ui.canvas.height;

    }

    activate_image(imageElement) {
        this.active_image = imageElement;

        this.originX = (this.canvas_width - this.active_image.image.width) * 0.5;
        this.originY = (this.canvas_height - this.active_image.image.height) * 0.5;

        this.draw();
    }

    draw() {
        this.ui.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);

        this.ui.ctx.drawImage(this.active_image.image, this.originX, this.originY);

        this.label_boxes.forEach(rect => {
            rect.draw(this.originX, this.originY, this.ui.ctx);
        });
    }
}