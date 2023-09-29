import { eventhandler } from "../../application.js";

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

export class LabelEditor {
    constructor(app, contentNode) {
        this.app = app;
        this.contentNode = contentNode;

        this.canvasNode = document.createElement("canvas");
        this.contentNode.appendChild(this.canvasNode);
        this.ctx = this.canvasNode.getContext("2d");
        this.zoom = 1;
        this.canLabel = () => this.isProjectLoaded && this.selectedLabelixImage && this.labelClasses.length > 0;

        this.isProjectLoaded = false

        eventhandler.connect("projectLoaded", () => this.isProjectLoaded = true);

        eventhandler.connect("componentsBuilt", () => {
            this.labelClasses = this.app.sidebar.classEditor.labelClasses;
        })

        eventhandler.connect("explorer.imageSelected", (labelixImage) => {
            this.selectedLabelixImage = labelixImage;
            this.zoom = 1;
            this.updateImageScaleFactor();
            this.render();
        });

        eventhandler.connect("classEditor.labelClassSelected", (labelClass) => {
            this.selectedLabelClass = labelClass;
        });

        this.updateWindowDimensions();
        window.addEventListener("resize", () => {
            this.updateWindowDimensions();

            if (this.selectedLabelixImage != null) {
                this.updateImageScaleFactor();
            }
        });

        this.canvasNode.addEventListener("wheel", (event) => {
            event.preventDefault();
            if (!this.isProjectLoaded) {
                return;
            }
            const zoomFactor = -0.1;
            const zoom = this.zoom * (1 + zoomFactor * (event.deltaY / 100));
            this.zoom = Math.max(0.1, Math.min(10, zoom));
            this.render();
        });
        this.canvasNode.addEventListener("mouseenter", () => {
            //this.canvasNode.style.cursor = "crosshair";
        });

        this.canvasNode.addEventListener("mouseleave", () => {
            //this.canvasNode.style.cursor = "default";
        });

        this.leftMouseDown = false;
        this.canvasNode.addEventListener("mousedown", (event) => {
            if (!this.canLabel()) {
                return;
            }
            const mouseButton = getMouseButton(event);
            if (mouseButton === "left") {
                if (!this.leftMouseDown) {
                    this.leftMouseDown = true;
                    this.labelStartX = this.cursorX;
                    this.labelStartY = this.cursorY;
                }
            }
        });
        document.addEventListener("mouseup", (event) => {
            if (!this.canLabel()) {
                return;
            }

            const mouseButton = getMouseButton(event);
            if (mouseButton === "left" && this.leftMouseDown) {
                this.leftMouseDown = false;
                this.saveLabelBox();
            }
        });
        this.canvasNode.addEventListener("mousemove", (event) => {
            if (!this.canLabel()) {
                return;
            }
            let bounds = this.canvasNode.getBoundingClientRect();
            //update Cursor Position
            this.cursorX = event.clientX - bounds.left;
            this.cursorY = event.clientY - bounds.top;

            this.render();

            if (this.leftMouseDown) {
                let startX = Math.min(this.labelStartX, this.cursorX);
                let startY = Math.min(this.labelStartY, this.cursorY);
                let width = Math.abs(this.labelStartX - this.cursorX);
                let height = Math.abs(this.labelStartY - this.cursorY);
                this.ctx.strokeRect(startX, startY, width, height);
            }
        });
    }

    updateWindowDimensions() {
        this.canvasWidth = this.contentNode.clientWidth;
        this.canvasHeight = this.contentNode.clientHeight;

        this.canvasCenterX = this.canvasWidth * 0.5;
        this.canvasCenterY = this.canvasHeight * 0.5;

        this.canvasNode.width = this.canvasWidth;
        this.canvasNode.height = this.canvasHeight;
    }

    updateImageScaleFactor() {
        const ratioX = this.canvasWidth / this.selectedLabelixImage.canvasImage.width;
        const ratioY =  this.canvasHeight / this.selectedLabelixImage.canvasImage.height;
        if (ratioX < ratioY) {
            this.scaleFactor = ratioX;
        }
        else {
            this.scaleFactor = ratioY;
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.renderImage();
        if (this.labelClasses.length > 0) {
            this.renderLabelBoxes();
        }
    }

    renderImage() {
        let x = this.canvasCenterX - (this.selectedLabelixImage.canvasImage.width * this.scaleFactor * this.zoom * 0.5);
        let y = this.canvasCenterY - (this.selectedLabelixImage.canvasImage.height * this.scaleFactor * this.zoom * 0.5);
        let w = this.selectedLabelixImage.canvasImage.width * this.scaleFactor * this.zoom;
        let h = this.selectedLabelixImage.canvasImage.height * this.scaleFactor * this.zoom;
        
        this.ctx.drawImage(this.selectedLabelixImage.canvasImage, x, y, w, h);
    }

    renderLabelBoxes() {
        this.selectedLabelixImage.labelBoxes.forEach(labelBox => {
            const labelClassIndex = labelBox[0];
            console.log(labelBox);
            if (!Number.isInteger(labelClassIndex) || labelClassIndex >= this.labelClasses.length) {
                return
            }
            let totalWidth = this.selectedLabelixImage.canvasImage.width * this.scaleFactor * this.zoom;
            let width = labelBox[3] * 2 * totalWidth;
            let leftCanvas = this.canvasCenterX - (this.selectedLabelixImage.canvasImage.width * this.scaleFactor * this.zoom * 0.5);
            let centerX = labelBox[1] * totalWidth + leftCanvas;
            let startX = centerX - width * 0.5

            let totalHeight = this.selectedLabelixImage.canvasImage.height * this.scaleFactor * this.zoom;
            let height = labelBox[4] * 2 * totalHeight;
            let topCanvas = this.canvasCenterY - (this.selectedLabelixImage.canvasImage.height * this.scaleFactor * this.zoom * 0.5);
            let centerY = labelBox[2] * totalHeight + topCanvas;
            let startY = centerY - height * 0.5

            this.ctx.strokeStyle = this.labelClasses[labelClassIndex].color;
            this.ctx.strokeRect(startX, startY, width, height);
        });
    }

    saveLabelBox() {
        let startX = Math.min(this.labelStartX, this.cursorX);
        let startY = Math.min(this.labelStartY, this.cursorY);
        let width = Math.abs(this.labelStartX - this.cursorX);
        let height = Math.abs(this.labelStartY - this.cursorY);


        let totalWidth = this.selectedLabelixImage.canvasImage.width * this.scaleFactor * this.zoom;
        let leftCanvas = this.canvasCenterX - (this.selectedLabelixImage.canvasImage.width * this.scaleFactor * this.zoom * 0.5)
        let centerX = startX + width * 0.5;
        let x = (centerX - leftCanvas) / totalWidth;
        
        let totalHeight = this.selectedLabelixImage.canvasImage.height * this.scaleFactor * this.zoom;
        let topCanvas = this.canvasCenterY - (this.selectedLabelixImage.canvasImage.height * this.scaleFactor * this.zoom * 0.5)
        let centerY = startY + height * 0.5;
        let y = (centerY - topCanvas) / totalHeight;
        
        let w = width * 0.5 / totalWidth;
        let h = height * 0.5 / totalHeight;

        console.log(this.labelClasses.indexOf(this.selectedLabelClass));
        this.selectedLabelixImage.labelBoxes.push([this.labelClasses.indexOf(this.selectedLabelClass), x, y, w, h]);
        window.electronAPI.writeLabels(this.selectedLabelixImage.path, this.selectedLabelixImage.labelBoxes);
    }
}