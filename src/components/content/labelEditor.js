import { eventhandler } from "../../application.js";
import { ContentBase } from "./contentBase.js";

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

export class LabelEditor extends ContentBase {
    constructor(app, contentContainerNode,contentbarNode) {
        super(app, contentContainerNode, contentbarNode);
        this.name = "LabelEditor";

        this.scaleX = 1;
        this.scaleY = 1;
        this.canLabel = () => this.isProjectLoaded && this.selectedLabelixImage && this.labelClasses.length > 0;
        this.currentLabelPositions = [];

        this.isProjectLoaded = false

        eventhandler.connect("projectLoaded", (dirPath, project) => {
            this.isProjectLoaded = true;
            let count = 0;
            project.images.forEach(image => {
                image.labelBoxes = [];
                
                image.canvasImage.addEventListener("load", () => {
                    count++;
                    image.labelBoxesNormalized.forEach(labelBoxNormalized => {
                        image.labelBoxes.push(this.fromLabelNormalized(labelBoxNormalized, image.canvasImage));
                    });

                    if (count === project.images.length -1) {
                        this.render();
                    }
                });
            });
        });

        eventhandler.connect("componentsBuilt", () => {
            this.labelClasses = this.app.sidebar.classEditor.labelClasses;
        })

        eventhandler.connect("explorer.imageSelected", (labelixImage) => {
            this.selectedLabelixImage = labelixImage;
            this.updateImageScaleFactor();

            this.scaleX = 1;
            this.scaleY = 1;
            this.offsetX = 0;

            this.offsetY = 0;
            this.render();
        });

        eventhandler.connect("classEditor.labelClassSelected", (labelClass) => {
            this.selectedLabelClass = labelClass;
        });

        eventhandler.connect("labelBoxesModified", (labelixImage) => {
            this.saveLabelBoxes(labelixImage);
            if (labelixImage === this.selectedLabelixImage) this.render();
        });

        eventhandler.connect("sidebar.resized", () => {
            if (!this.isHidden) {
                this.updateWindowDimensions();
            }

            if (this.selectedLabelixImage != null) {
                this.updateImageScaleFactor();
            }
            this.render();
        });

        window.addEventListener("resize", () => {
            if (!this.isHidden) {
                this.updateWindowDimensions();
            }

            if (this.selectedLabelixImage != null) {
                this.updateImageScaleFactor();
            }
            this.render();
        });
    }

    show() {
        super.show();
        this.canvasNode = document.createElement("canvas");
        this.contentContainerNode.appendChild(this.canvasNode);
        this.ctx = this.canvasNode.getContext("2d");
        this.updateWindowDimensions();

        this.canvasNode.addEventListener("wheel", (event) => {
            event.preventDefault();
            this.onMouseScroll(event.deltaY);
        });

        this.canvasNode.addEventListener("mousemove", (event) => {
            const bounds = this.canvasNode.getBoundingClientRect();
            this.mouseX = event.clientX - bounds.left;
            this.mouseY = event.clientY - bounds.top;
            this.onMousePositionChange();
        });

        this.canvasNode.addEventListener("mousedown", (event) => {
            const mouseButton = getMouseButton(event);
            if (mouseButton === "left") {
                this.onLeftMouseDown();
            }
            else if(mouseButton == "right") {
                this.onRightMouseDown();
            }
        });

        this.canvasNode.addEventListener("mouseleave", (event) => {
            this.render();
        });

        this.render();
    }

    onLeftMouseDown() {
        if (!this.canLabel()) {
            return;
        }
        let [x, y] = this.screenToWorld(this.mouseX, this.mouseY);
        [x,y] = this.clampPositionInImage(x, y);
        this.currentLabelPositions.push(x);
        this.currentLabelPositions.push(y);

        if (this.currentLabelPositions.length === 4) {
            this.addLabelBox(this.currentLabelPositions);
            this.currentLabelPositions = [];
        }
    }

    onRightMouseDown() {
        if (!this.canLabel()) {
            return;
        }

        const remainingLabelBoxes = [];
        const removedLabelBoxes = [];
        const [worldMouseX, worldMouseY] = this.screenToWorld(this.mouseX, this.mouseY);
        this.selectedLabelixImage.labelBoxes.forEach(labelBox => {
            const [labelClassIndex, x1, y1, x2, y2] = labelBox;
            if (x1 <= worldMouseX && x2 >= worldMouseX && y1 <= worldMouseY && y2 >= worldMouseY) {
                removedLabelBoxes.push(labelBox);
                return;
            }
            remainingLabelBoxes.push(labelBox);
        });
        this.selectedLabelixImage.labelBoxes = remainingLabelBoxes;
        removedLabelBoxes.forEach(labelBox => {
            eventhandler.emit("labelBoxesModified", this.selectedLabelixImage);
        });
    }

    onMousePositionChange() {
        if (!this.canLabel()) {
            return;
        }

        this.render();
        this.renderCrossHair();

        if (this.currentLabelPositions.length === 2) {
            const [startX, startY] = this.worldToScreen(this.currentLabelPositions[0], this.currentLabelPositions[1]);
            const [worldEX, worldEY] = this.screenToWorld(this.mouseX, this.mouseY);
            const [clampedWorldEX, clampedWorldEY] = this.clampPositionInImage(worldEX, worldEY);
            const [screenEX, screenEY] = this.worldToScreen(clampedWorldEX, clampedWorldEY);
            const leftX = Math.min(startX, screenEX);
            const leftY = Math.min(startY, screenEY);
    
            const width = Math.abs(screenEX - startX);
            const height = Math.abs(screenEY - startY);
            
            this.ctx.strokeStyle = this.selectedLabelClass.color;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(leftX, leftY, width, height);
        }
    }

    onMouseScroll(deltaY) {
        if (!this.isProjectLoaded) {
            return;
        }

        const [mouseWorldXBeforeZoom, mouseWorldYBeforeZoom] = this.screenToWorld(this.mouseX, this.mouseY);
        //for zoom
        const zoomFactor = -0.1;
        const newZoom = this.scaleX * (1 + zoomFactor * (deltaY / 100));
        const zoom = Math.max(0.1, Math.min(10, newZoom));
        this.scaleX = zoom;
        this.scaleY = zoom;

        const [mouseWorldXAfterZoom, mouseWorldYAfterZoom] = this.screenToWorld(this.mouseX, this.mouseY);

        this.offsetX += mouseWorldXBeforeZoom - mouseWorldXAfterZoom;
        this.offsetY += mouseWorldYBeforeZoom - mouseWorldYAfterZoom;
        
        this.render();
        this.renderCrossHair();
    }

    updateWindowDimensions() {
        if (this.canvasWidth !== undefined && this.canvasHeight !== undefined) {
            if (this.offsetX !== 0) {
                this.offsetX = this.offsetX / this.canvasWidth * this.contentContainerNode.clientWidth;
            }
            if (this.offsetY !== 0) {
                this.offsetY = this.offsetY / this.canvasHeight * this.contentContainerNode.clientHeight;
            }
        }
        this.canvasWidth = this.contentContainerNode.clientWidth;
        this.canvasHeight = this.contentContainerNode.clientHeight;

        this.canvasNode.width = this.canvasWidth;
        this.canvasNode.height = this.canvasHeight;

        this.canvasOffsetX = -this.canvasWidth/2;
        this.canvasOffsetY = -this.canvasHeight/2;
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
        if (this.isHidden || this.selectedLabelixImage == null) {
            return;
        }
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.renderImage();
        if (this.labelClasses.length > 0) {
            this.renderLabelBoxes();
        }
    }

    renderImage() {
        const [x1, y1] = this.worldToScreen(-this.selectedLabelixImage.canvasImage.width/2, -this.selectedLabelixImage.canvasImage.height/2);
        const [x2, y2] = this.worldToScreen(this.selectedLabelixImage.canvasImage.width/2, this.selectedLabelixImage.canvasImage.height/2);
        this.ctx.drawImage(this.selectedLabelixImage.canvasImage, x1, y1, x2-x1, y2-y1);
    }

    renderLabelBoxes() {
        this.selectedLabelixImage.labelBoxes.forEach(labelBox => {
            const [labelClassIndex, x1, y1, x2, y2] = labelBox;
            if (!Number.isInteger(labelClassIndex) || labelClassIndex >= this.labelClasses.length, labelClassIndex < 0) {
                return
            }
            const [screenX1, screenY1] = this.worldToScreen(x1, y1);
            const [screenX2, screenY2] = this.worldToScreen(x2, y2);
            this.ctx.strokeStyle = this.labelClasses[labelClassIndex].color;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(screenX1, screenY1, screenX2-screenX1, screenY2-screenY1);
        });
    }

    renderCrossHair() {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.mouseY);
        this.ctx.lineTo(this.canvasWidth, this.mouseY);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "red";
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.mouseX, 0);
        this.ctx.lineTo(this.mouseX, this.canvasHeight);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "red";
        this.ctx.stroke();
    }

    addLabelBox(labelPositions) {
        const indexLabelClass = this.labelClasses.indexOf(this.selectedLabelClass)
        if (indexLabelClass < 0 ) {
            return;
        }
        const [x1, y1, x2, y2] = labelPositions;
        const sx = Math.min(x1, x2);
        const ex = Math.max(x1, x2);
        const sy = Math.min(y1, y2);
        const ey = Math.max(y1, y2);

        this.selectedLabelixImage.labelBoxes.push([indexLabelClass, sx, sy, ex, ey]);
        eventhandler.emit("labelBoxesModified", this.selectedLabelixImage);
    }

    saveLabelBoxes(labelixImage) {
        const labelBoxesNormalized = [];
        labelixImage.labelBoxes.forEach(labelBox => {
            labelBoxesNormalized.push(this.toLabelNormalized(labelBox, labelixImage.canvasImage));
        });
        window.electronAPI.writeLabels(labelixImage.imagePath, labelBoxesNormalized);
    }

    fromLabelNormalized(labelBoxNormalized, canvasImage) {
            const [labelClassIndex, x, y, w, h] = labelBoxNormalized;
            const width = w * canvasImage.width;
            const height = h * canvasImage.height;

            const sx = (x * canvasImage.width) - canvasImage.width / 2 - width / 2;
            const sy = (y * canvasImage.height) - canvasImage.height / 2 - height / 2;

            const ex = sx +  width;
            const ey = sy + height;
            return [labelClassIndex, sx, sy, ex, ey];
    }

    toLabelNormalized(labelBox, canvasImage) {
        const sx = Math.min(labelBox[1], labelBox[3]);
        const sy = Math.min(labelBox[2], labelBox[4]);
        const width = Math.abs(labelBox[1] - labelBox[3]);
        const height = Math.abs(labelBox[2] - labelBox[4]);

        const x = (sx + width / 2 + canvasImage.width / 2) / canvasImage.width;
        const y = (sy + height / 2 + canvasImage.height / 2) / canvasImage.height;
        const w = width / canvasImage.width;
        const h = height / canvasImage.height;
        return [labelBox[0], x, y, w, h];
    }
}