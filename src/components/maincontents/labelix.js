import { eventhandler } from "../../application.js";

class LabelBox {
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

        case 1:
        return "middle";

        case 2:
        return "right";

        default:
        return "undefined yet";
    }
}

export class Labelix {
    constructor(mainContentNode) {
        this.mainContentNode = mainContentNode

        this.canvasNode = document.createElement("canvas");
        this.mainContentNode.appendChild(this.canvasNode);
        this.ctx = this.canvasNode.getContext("2d");

        this.resize();
        window.addEventListener("resize", () => {
            this.resize()
        });
        eventhandler.connect("sideContent:resize", () => {
            this.resize();
        });

        eventhandler.connect("explorer:imageSelected", (labelixImage) => this.onImageSelected(labelixImage))

        this.canvasNode.addEventListener("wheel", (event) => {
            if (this.selectedImage == null) {
                return;
            }
            event.preventDefault();
            const zoomFactor = -0.1;
            const zoom = this.zoom * (1 + zoomFactor * (event.deltaY / 100));
            this.zoom = Math.max(0.1, Math.min(10, zoom));
            this.render();
        });

        this.leftMouseDown = false;
        this.canvasNode.addEventListener("mousedown", (event) => {
            if (this.selectedImage == null) {
                return;
            }
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
            if (this.selectedImage == null) {
                return;
            }

            const mouseButton = getMouseButton(event);
            if (mouseButton === "left") {
                if (this.leftMouseDown) {
                    this.leftMouseDown = false;
                    this.saveLabelbox();
                }
            }
        });
        this.canvasNode.addEventListener("mousemove", (event) => {
            if (this.selectedImage == null) {
                return;
            }
            let bounds = this.canvasNode.getBoundingClientRect();
            //update Cursor Position
            this.cursorX = event.clientX - bounds.left;
            this.cursorY = event.clientY - bounds.top;

            this.render();

            if (this.leftMouseDown) {
                let startX = Math.min(this.startX, this.cursorX);
                let startY = Math.min(this.startY, this.cursorY);
                let width = Math.abs(this.startX - this.cursorX);
                let height = Math.abs(this.startY - this.cursorY);
                this.ctx.strokeRect(startX, startY, width, height);
            }
        });
    }

    resize() {
        this.canvasWidth = this.mainContentNode.clientWidth;
        this.canvasHeight = this.mainContentNode.clientHeight;

        this.canvasNode.width = this.canvasWidth;
        this.canvasNode.height = this.canvasHeight;
    }

    onImageSelected(labelixImage) {
        this.labelBoxes = []
        this.selectedImage = labelixImage;

        const ratioX = this.canvasWidth / this.selectedImage.canvasImage.width;
        const ratioY =  this.canvasHeight / this.selectedImage.canvasImage.height;

        // can be changed with mouse wheel
        this.zoom = 1;
        // scale to resize image to canvas size
        if (ratioX < ratioY) {
            this.scaleMaximize = ratioX;
        }
        else {
            this.scaleMaximize = ratioY;
        }

        this.canvasCenterX = this.canvasWidth * 0.5;
        this.canvasCenterY = this.canvasHeight * 0.5;
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        let x = this.canvasCenterX - (this.selectedImage.canvasImage.width * this.scaleMaximize * this.zoom * 0.5);
        let y = this.canvasCenterY - (this.selectedImage.canvasImage.height * this.scaleMaximize * this.zoom * 0.5);
        let w = this.selectedImage.canvasImage.width * this.scaleMaximize * this.zoom;
        let h = this.selectedImage.canvasImage.height * this.scaleMaximize * this.zoom;
        this.ctx.drawImage(this.selectedImage.canvasImage, x, y, w, h);

        this.labelBoxes.forEach(labelBox => {
            this.drawLabelBox(labelBox);
        });
    }

    saveLabelbox() {
        let startX = Math.min(this.startX, this.cursorX);
        let startY = Math.min(this.startY, this.cursorY);
        let width = Math.abs(this.startX - this.cursorX);
        let height = Math.abs(this.startY - this.cursorY);


        let totalWidth = this.selectedImage.canvasImage.width * this.scaleMaximize * this.zoom;
        let leftCanvas = this.canvasCenterX - (this.selectedImage.canvasImage.width * this.scaleMaximize * this.zoom * 0.5)
        let centerX = startX + width * 0.5;
        let x = (centerX - leftCanvas) / totalWidth;
        
        let totalHeight = this.selectedImage.canvasImage.height * this.scaleMaximize * this.zoom;
        let topCanvas = this.canvasCenterY - (this.selectedImage.canvasImage.height * this.scaleMaximize * this.zoom * 0.5)
        let centerY = startY + height * 0.5;
        let y = (centerY - topCanvas) / totalHeight;
        
        let w = width * 0.5 / totalWidth;
        let h = height * 0.5 / totalHeight;

        this.labelBoxes.push(new LabelBox(x, y, w, h));
    }

    drawLabelBox(labelBox) {
        let totalWidth = this.selectedImage.canvasImage.width * this.scaleMaximize * this.zoom;
        let width = labelBox.w * 2 * totalWidth;
        let leftCanvas = this.canvasCenterX - (this.selectedImage.canvasImage.width * this.scaleMaximize * this.zoom * 0.5);
        let centerX = labelBox.x * totalWidth + leftCanvas;
        let startX = centerX - width * 0.5

        let totalHeight = this.selectedImage.canvasImage.height * this.scaleMaximize * this.zoom;
        let height = labelBox.h * 2 * totalHeight;
        let topCanvas = this.canvasCenterY - (this.selectedImage.canvasImage.height * this.scaleMaximize * this.zoom * 0.5);
        let centerY = labelBox.y * totalHeight + topCanvas;
        let startY = centerY - height * 0.5

        this.ctx.strokeRect(startX, startY, width, height);
    }
}