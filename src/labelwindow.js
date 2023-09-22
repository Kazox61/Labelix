import { eventhandler } from "./labelix.js";

export class LabelBox {
    constructor(x, y, w, h) {
        //normalized
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

function getMouseButton(event) {
    const e = event || window.event;
    const btnCode = e.button;

    switch (btnCode) {
        case 0:
        return "left";
        break;

        case 1:
        return "middle";
        break;

        case 2:
        return "right";
        break;

        default:
        return "undefined yet";
    }
}

export class LabelWindow {
    constructor(ui) {
        this.ui = ui;

        this.selectedImage = null;
        this.canvasWidth = this.ui.canvas.width;
        this.canvasHeight = this.ui.canvas.height;
        this.cursorX = null;
        this.cursorY = null;
        this.leftMouseDown = false;

        this.startX = null;
        this.startY = null;

        this.labelBoxes = [];

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

        eventhandler.connect("imageSelected", (image) => {
            this.init();
            this.onImageSelected(image);
        });

        this.ui.canvas.addEventListener("wheel", (event) => {
            event.preventDefault();

            const zoomFactor = -0.1; // Adjust this value to control the scaling speed

            // Calculate the new scale relative to the current scale
            const zoom = this.zoom * (1 + zoomFactor * (event.deltaY / 100));

            // Apply a minimum and maximum scale limit if desired
            // For example, you can use Math.min and Math.max:
            this.zoom = Math.max(0.1, Math.min(10, zoom));
            this.render();
        });
    }

    init() {
        this.ui.canvas.addEventListener("mousemove", (event) => {
            let bounds = this.ui.canvas.getBoundingClientRect();
            //update Cursor Position
            this.cursorX = event.clientX - bounds.left;
            this.cursorY = event.clientY - bounds.top;

            this.render();

            if (this.leftMouseDown) {
                let startX = Math.min(this.startX, this.cursorX);
                let startY = Math.min(this.startY, this.cursorY);
                let width = Math.abs(this.startX - this.cursorX);
                let height = Math.abs(this.startY - this.cursorY);
                this.ui.ctx.strokeRect(startX, startY, width, height);
            }
        });

        this.ui.canvas.addEventListener("mousedown", (event) => {
            const mouseButton = getMouseButton(event);
            if (mouseButton === "left") {
                if (!this.leftMouseDown) {
                    this.leftMouseDown = true;
                    this.startX = this.cursorX;
                    this.startY = this.cursorY;
                }
            } 

            
        });

        document.addEventListener("mouseup", (event) => {
            const mouseButton = getMouseButton(event);
            if (mouseButton === "left") {
                if (this.leftMouseDown) {
                    this.leftMouseDown = false;
                    this.saveLabelbox();
                }
            }
        });
    }

    saveLabelbox() {
        let startX = Math.min(this.startX, this.cursorX);
        let startY = Math.min(this.startY, this.cursorY);
        let width = Math.abs(this.startX - this.cursorX);
        let height = Math.abs(this.startY - this.cursorY);


        let totalWidth = this.selectedImage.canvasImage.width * this.scale * this.zoom;
        let leftCanvas = this.canvasCenterX - (this.selectedImage.canvasImage.width * this.scale * this.zoom * 0.5)
        let centerX = startX + width * 0.5;
        let x = (centerX - leftCanvas) / totalWidth;
        
        let totalHeight = this.selectedImage.canvasImage.height * this.scale * this.zoom;
        let topCanvas = this.canvasCenterY - (this.selectedImage.canvasImage.height * this.scale * this.zoom * 0.5)
        let centerY = startY + height * 0.5;
        let y = (centerY - topCanvas) / totalHeight;
        
        let w = width * 0.5 / totalWidth;
        let h = height * 0.5 / totalHeight;

        this.labelBoxes.push(new LabelBox(x, y, w, h));
    }

    resizeCanvas() {
        this.ui.canvas.width = window.innerWidth - this.ui.sidebarBorderPosition;
        this.ui.canvas.height = window.innerHeight - 25;

        this.canvasWidth = this.ui.canvas.width;
        this.canvasHeight = this.ui.canvas.height;

    }

    onImageSelected(image) {
        this.selectedImage = image;

        const ratioX = this.canvasWidth / this.selectedImage.canvasImage.width;
        const ratioY =  this.canvasHeight / this.selectedImage.canvasImage.height;

        this.zoom = 1;

        if (ratioX < ratioY) {
            this.scale = ratioX;
        }
        else {
            this.scale = ratioY;
        }

        this.canvasCenterX = this.canvasWidth * 0.5;
        this.canvasCenterY = this.canvasHeight * 0.5;

        this.render();
    }

    render() {
        this.ui.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        let x = this.canvasCenterX - (this.selectedImage.canvasImage.width * this.scale * this.zoom * 0.5);
        let y = this.canvasCenterY - (this.selectedImage.canvasImage.height * this.scale * this.zoom * 0.5);

        let w = this.selectedImage.canvasImage.width * this.scale * this.zoom;
        let h = this.selectedImage.canvasImage.height * this.scale * this.zoom;

        this.ui.ctx.drawImage(this.selectedImage.canvasImage, x, y, w, h);

        this.labelBoxes.forEach(labelBox => {
            this.drawLabelBox(labelBox);
        });
    }

    drawLabelBox(labelBox) {
        let totalWidth = this.selectedImage.canvasImage.width * this.scale * this.zoom;
        let width = labelBox.w * 2 * totalWidth;
        let leftCanvas = this.canvasCenterX - (this.selectedImage.canvasImage.width * this.scale * this.zoom * 0.5);
        let centerX = labelBox.x * totalWidth + leftCanvas;
        let startX = centerX - width * 0.5

        let totalHeight = this.selectedImage.canvasImage.height * this.scale * this.zoom;
        let height = labelBox.h * 2 * totalHeight;
        let topCanvas = this.canvasCenterY - (this.selectedImage.canvasImage.height * this.scale * this.zoom * 0.5);
        let centerY = labelBox.y * totalHeight + topCanvas;
        let startY = centerY - height * 0.5

        this.ui.ctx.strokeRect(startX, startY, width, height);
    }
}