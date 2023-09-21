import { eventhandler } from "./labelix.js";

export class LabelBox {
    constructor(x, y, w, h) {
        //normalized
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

        this.scale = 1;
        this.zoom = 1;

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

        this.ui.canvas.addEventListener("wheel", (event) => {
            event.preventDefault();

            const zoomFactor = -0.1; // Adjust this value to control the scaling speed

            // Calculate the new scale relative to the current scale
            const zoom = this.zoom * (1 + zoomFactor * (event.deltaY / 100));

            // Apply a minimum and maximum scale limit if desired
            // For example, you can use Math.min and Math.max:
            this.zoom = Math.max(0.1, Math.min(10, zoom));
            this.draw();
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


                let totalWidth = this.active_image.image.width * this.scale * this.zoom;
                let leftCanvas = this.canvasCenterX - (this.active_image.image.width * this.scale * this.zoom * 0.5)
                let centerX = startX + width * 0.5;
                let x = (centerX - leftCanvas) / totalWidth;
                
                let totalHeight = this.active_image.image.height * this.scale * this.zoom;
                let topCanvas = this.canvasCenterY - (this.active_image.image.height * this.scale * this.zoom * 0.5)
                let centerY = startY + height * 0.5;
                let y = (centerY - topCanvas) / totalHeight;
                
                let w = width * 0.5 / totalWidth;
                let h = height * 0.5 / totalHeight;

                this.label_boxes.push(new LabelBox(x, y, w, h));
            }
        });
    }

    resizeCanvas() {
        this.ui.canvas.width = window.innerWidth - this.ui.sidebar_border_position;
        this.ui.canvas.height = window.innerHeight - 25;

        this.canvas_width = this.ui.canvas.width;
        this.canvas_height = this.ui.canvas.height;

    }

    activate_image(imageElement) {
        this.active_image = imageElement;

        const ratioX = this.canvas_width / this.active_image.image.width;
        const ratioY =  this.canvas_height / this.active_image.image.height;

        this.zoom = 1;

        if (ratioX < ratioY) {
            this.scale = ratioX;
        }
        else {
            this.scale = ratioY;
        }

        this.canvasCenterX = this.canvas_width * 0.5;
        this.canvasCenterY = this.canvas_height * 0.5;

        this.draw();
    }

    draw() {
        this.ui.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);

        let x = this.canvasCenterX - (this.active_image.image.width * this.scale * this.zoom * 0.5);
        let y = this.canvasCenterY - (this.active_image.image.height * this.scale * this.zoom * 0.5);

        let w = this.active_image.image.width * this.scale * this.zoom;
        let h = this.active_image.image.height * this.scale * this.zoom;

        this.ui.ctx.drawImage(this.active_image.image, x, y, w, h);

        this.label_boxes.forEach(rect => {
            this.drawLabelBox(rect);
        });
    }

    drawLabelBox(rect) {
        let totalWidth = this.active_image.image.width * this.scale * this.zoom;
        let width = rect.w * 2 * totalWidth;
        let leftCanvas = this.canvasCenterX - (this.active_image.image.width * this.scale * this.zoom * 0.5);
        let centerX = rect.x * totalWidth + leftCanvas;
        let startX = centerX - width * 0.5

        let totalHeight = this.active_image.image.height * this.scale * this.zoom;
        let height = rect.h * 2 * totalHeight;
        let topCanvas = this.canvasCenterY - (this.active_image.image.height * this.scale * this.zoom * 0.5);
        let centerY = rect.y * totalHeight + topCanvas;
        let startY = centerY - height * 0.5

        this.ui.ctx.strokeRect(startX, startY, width, height);
    }
}