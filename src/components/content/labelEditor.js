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
        this.scaleX = 1;
        this.scaleY = 1;
        this.canLabel = () => this.isProjectLoaded && this.selectedLabelixImage && this.labelClasses.length > 0;
        this.currentLabelPositions = [];

        this.isProjectLoaded = false

        eventhandler.connect("projectLoaded", () => this.isProjectLoaded = true);

        eventhandler.connect("componentsBuilt", () => {
            this.labelClasses = this.app.sidebar.classEditor.labelClasses;
        })

        eventhandler.connect("explorer.imageSelected", (labelixImage) => {
            this.selectedLabelixImage = labelixImage;
            this.scaleX = 1;
            this.scaleY = 1;
            this.offsetX = 0;
            
            this.offsetY = 0;
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
            this.render();
        });

        this.canvasNode.addEventListener("wheel", (event) => {
            event.preventDefault();
            if (!this.isProjectLoaded) {
                return;
            }

            const [mouseWorldXBeforeZoom, mouseWorldYBeforeZoom] = this.screenToWorld(this.mouseX, this.mouseY);
            //for zoom
            const zoomFactor = -0.1;
            const newZoom = this.scaleX * (1 + zoomFactor * (event.deltaY / 100));
            const zoom = Math.max(0.1, Math.min(10, newZoom));
            this.scaleX = zoom;
            this.scaleY = zoom;

            const [mouseWorldXAfterZoom, mouseWorldYAfterZoom] = this.screenToWorld(this.mouseX, this.mouseY);

            this.offsetX += mouseWorldXBeforeZoom - mouseWorldXAfterZoom;
            this.offsetY += mouseWorldYBeforeZoom - mouseWorldYAfterZoom;
            
            this.render();
        });
        this.canvasNode.addEventListener("mouseenter", () => {
            //this.canvasNode.style.cursor = "crosshair";
        });

        this.canvasNode.addEventListener("mouseleave", () => {
            //this.canvasNode.style.cursor = "default";
        });

        this.canvasNode.addEventListener("mousemove", (event) => {
            //update Cursor Position
            const bounds = this.canvasNode.getBoundingClientRect();
            this.mouseX = event.clientX - bounds.left;
            this.mouseY = event.clientY - bounds.top;

            if (!this.canLabel()) {
                return;
            }

            this.render();

            if (this.currentLabelPositions.length === 2) {
                const [startX, startY] = this.worldToScreen(this.currentLabelPositions[0], this.currentLabelPositions[1]);
                const [worldEX, worldEY] = this.screenToWorld(this.mouseX, this.mouseY);
                const [clampedWorldEX, clampedWorldEY] = this.clampPositionInImage(worldEX, worldEY);
                const [screenEX, screenEY] = this.worldToScreen(clampedWorldEX, clampedWorldEY);
                const leftX = Math.min(startX, screenEX);
                const leftY = Math.min(startY, screenEY);
        
                const width = Math.abs(screenEX - startX);
                const height = Math.abs(screenEY - startY);
                this.ctx.strokeRect(leftX, leftY, width, height);
            }
        });

        this.canvasNode.addEventListener("mousedown", (event) => {
            if (!this.canLabel()) {
                return;
            }
            const mouseButton = getMouseButton(event);
            if (mouseButton === "left") {
                let [x, y] = this.screenToWorld(this.mouseX, this.mouseY);
                [x,y] = this.clampPositionInImage(x, y);
                this.currentLabelPositions.push(x);
                this.currentLabelPositions.push(y);

                if (this.currentLabelPositions.length === 4) {
                    this.saveLabelBox(this.currentLabelPositions);
                    this.currentLabelPositions = [];
                    this.render();
                }
            }
        });
    }

    updateWindowDimensions() {
        this.canvasWidth = this.contentNode.clientWidth;
        this.canvasHeight = this.contentNode.clientHeight;

        this.canvasNode.width = this.canvasWidth;
        this.canvasNode.height = this.canvasHeight;

        this.canvasOffsetX = -this.canvasWidth/2;
        this.canvasOffsetY = -this.canvasHeight/2;
        this.offsetX = 0;
        this.offsetY = 0;
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

    worldToScreen(worldX, worldY) {
        const screenX = (worldX - (this.offsetX+this.canvasOffsetX)) * this.scaleX;
        const screenY = (worldY - (this.offsetY+this.canvasOffsetY)) * this.scaleY;
        return [screenX, screenY];
    }

    screenToWorld(screenX, screenY) {
       const worldX = screenX / this.scaleX + (this.offsetX+this.canvasOffsetX);
       const worldY = screenY / this.scaleY + (this.offsetY+this.canvasOffsetY);
       return [worldX, worldY];
    }

    clampPositionInImage(posX, posY) {
        const x = Math.max(-this.selectedLabelixImage.canvasImage.width/2, Math.min(this.selectedLabelixImage.canvasImage.width/2, posX));
        const y = Math.max(-this.selectedLabelixImage.canvasImage.height/2, Math.min(this.selectedLabelixImage.canvasImage.height/2, posY));
        return [x, y];
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.renderImage();
        if (this.labelClasses.length > 0) {
            this.renderLabelBoxes();
        }
    }

    renderImage() {
        const [startX, startY] = this.worldToScreen(-this.selectedLabelixImage.canvasImage.width/2, -this.selectedLabelixImage.canvasImage.height/2);
        const [endX, endY] = this.worldToScreen(this.selectedLabelixImage.canvasImage.width/2, this.selectedLabelixImage.canvasImage.height/2);
        this.ctx.drawImage(this.selectedLabelixImage.canvasImage, startX, startY, endX-startX, endY-startY);
    }

    renderLabelBoxes() {
        this.selectedLabelixImage.labelBoxes.forEach(labelBox => {
            const [labelClassIndex, x, y, w, h] = labelBox;
            if (!Number.isInteger(labelClassIndex) || labelClassIndex >= this.labelClasses.length) {
                return
            }
            const width = w * this.selectedLabelixImage.canvasImage.width * 2;
            const height = h * this.selectedLabelixImage.canvasImage.height * 2;


            const startX = (x * this.selectedLabelixImage.canvasImage.width) - this.selectedLabelixImage.canvasImage.width / 2 - width / 2;
            const startY = (y * this.selectedLabelixImage.canvasImage.height) - this.selectedLabelixImage.canvasImage.height / 2 - height / 2;

            this.ctx.strokeStyle = this.labelClasses[labelClassIndex].color;
            const [screenSX, screenSY] = this.worldToScreen(startX, startY);
            const [screenEX, screenEY] = this.worldToScreen(startX+width, startY+height);
            this.ctx.strokeRect(screenSX, screenSY, screenEX-screenSX, screenEY-screenSY);
        });
    }

    saveLabelBox(labelPositions) {
        const startX = Math.min(labelPositions[0], labelPositions[2]);
        const startY = Math.min(labelPositions[1], labelPositions[3]);
        const width = Math.abs(labelPositions[0] - labelPositions[2]);
        const height = Math.abs(labelPositions[1] - labelPositions[3]);

        const x = (startX + width / 2 + this.selectedLabelixImage.canvasImage.width / 2) / this.selectedLabelixImage.canvasImage.width;
        const y = (startY + height / 2 + this.selectedLabelixImage.canvasImage.height / 2) / this.selectedLabelixImage.canvasImage.height;
        const w = width / 2 / this.selectedLabelixImage.canvasImage.width;
        const h = height / 2 / this.selectedLabelixImage.canvasImage.height;

        this.selectedLabelixImage.labelBoxes.push([this.labelClasses.indexOf(this.selectedLabelClass), x, y, w, h]);
        window.electronAPI.writeLabels(this.selectedLabelixImage.path, this.selectedLabelixImage.labelBoxes);
    }
}