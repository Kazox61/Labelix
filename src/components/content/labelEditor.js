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
        this.currentLabelPositions = [];

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

        this.canvasNode.addEventListener("mousemove", (event) => {
            if (!this.canLabel()) {
                return;
            }
            let bounds = this.canvasNode.getBoundingClientRect();
            //update Cursor Position
            this.cursorX = event.clientX - bounds.left;
            this.cursorY = event.clientY - bounds.top;

            this.render();

            if (this.currentLabelPositions.length === 2) {
                console.log("RENDER RECT");
                
                const [endX, endY] = this.clampPositionInImage(this.cursorX, this.cursorY);
                let startX = Math.min(this.currentLabelPositions[0], endX);
                let startY = Math.min(this.currentLabelPositions[1], endY);
        
                let width = Math.abs(this.currentLabelPositions[0] - endX);
                let height = Math.abs(this.currentLabelPositions[1] - endY);
                this.ctx.strokeRect(startX, startY, width, height);
            }
        });

        this.canvasNode.addEventListener("mousedown", (event) => {
            if (!this.canLabel()) {
                return;
            }
            const mouseButton = getMouseButton(event);
            if (mouseButton === "left") {
                const [x, y] = this.clampPositionInImage(this.cursorX, this.cursorY);
                this.currentLabelPositions.push(x);
                this.currentLabelPositions.push(y);

                if (this.currentLabelPositions.length === 4) {
                    this.saveLabelBox(this.currentLabelPositions);
                    console.log("DRAW");
                    this.currentLabelPositions = [];
                    this.render();
                }
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

    //x-left, y-left, width, height
    getCurrentImageBounds() {
        const x = this.canvasCenterX - (this.selectedLabelixImage.canvasImage.width * this.scaleFactor * this.zoom * 0.5);
        const y = this.canvasCenterY - (this.selectedLabelixImage.canvasImage.height * this.scaleFactor * this.zoom * 0.5);
        const w = this.selectedLabelixImage.canvasImage.width * this.scaleFactor * this.zoom;
        const h = this.selectedLabelixImage.canvasImage.height * this.scaleFactor * this.zoom;
        return {x,y,w,h};
    }

    clampPositionInImage(posX, posY) {
        const {x,y,w,h} = this.getCurrentImageBounds();
        const newX = Math.max(x, Math.min(x+w, posX));
        const newY = Math.max(y, Math.min(y+h, posY));
        return [newX, newY];
    }

    renderImage() {
        const {x,y,w,h} = this.getCurrentImageBounds();
        
        this.ctx.drawImage(this.selectedLabelixImage.canvasImage, x, y, w, h);
    }

    renderLabelBoxes() {
        this.selectedLabelixImage.labelBoxes.forEach(labelBox => {
            const labelClassIndex = labelBox[0];
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

    saveLabelBox(labelPositions) {
        let startX = Math.min(labelPositions[0], labelPositions[2]);
        let startY = Math.min(labelPositions[1], labelPositions[3]);
        let width = Math.abs(labelPositions[0] - labelPositions[2]);
        let height = Math.abs(labelPositions[1] - labelPositions[3]);


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
        if (w < 0.05 || h < 0.05) {
            return;
        }

        this.selectedLabelixImage.labelBoxes.push([this.labelClasses.indexOf(this.selectedLabelClass), x, y, w, h]);
        window.electronAPI.writeLabels(this.selectedLabelixImage.path, this.selectedLabelixImage.labelBoxes);
    }
}