import { eventhandler } from "../../application.js";
import { Renderer } from "./renderer.js";

export class LabelEditor {
    constructor(app, contentNode) {
        this.app = app;
        this.contentNode = contentNode;

        this.canvasNode = document.createElement("canvas");
        this.contentNode.appendChild(this.canvasNode);
        this.ctx = this.canvasNode.getContext("2d");
        this.renderer = new Renderer(this.canvasNode, this.ctx);

        this.isProjectLoaded = false

        eventhandler.connect("projectLoaded", () => this.isProjectLoaded = true);

        eventhandler.connect("componentsBuilt", () => {
            this.labelClasses = this.app.sidebar.classEditor.labelClasses;
        })

        eventhandler.connect("explorer.imageSelected", (labelixImage) => {
            this.selectedLabelixImage = labelixImage;
            //this.ctx.drawImage(this.selectedLabelixImage.canvasImage, 0, 0);
            this.updateImageScaleFactor();
            this.renderImage();
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

    renderImage() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        let x = this.canvasCenterX - (this.selectedLabelixImage.canvasImage.width * this.scaleFactor * 0.5);
        let y = this.canvasCenterY - (this.selectedLabelixImage.canvasImage.height * this.scaleFactor * 0.5);
        let w = this.selectedLabelixImage.canvasImage.width * this.scaleFactor;
        let h = this.selectedLabelixImage.canvasImage.height * this.scaleFactor;
        
        this.ctx.drawImage(this.selectedLabelixImage.canvasImage, x, y, w, h);
    }
}