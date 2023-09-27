import { eventhandler } from "../../application.js";
import { Explorer } from "./explorer.js";

export class SideContent {
    constructor(settings) {
        this.settings = settings;
    }

    build(containerNode) {
        this.containerNode = containerNode;
        this.sideContentSettings = this.settings.sideContent;
        this.sideContentWidth = this.settings.sideContent.width;

        this.sideContentNode = document.createElement("div");
        this.sideContentNode.className = "sideContent";
        this.sideContentNode.style.setProperty("--sideContent-background", this.sideContentSettings.background);
        this.containerNode.style.setProperty("--sideContent-width", String(this.sideContentSettings.width)+"px");
        this.containerNode.appendChild(this.sideContentNode);

        this.sideContentResizeNode = document.createElement("div");
        this.sideContentResizeNode.className = "sideContentResize";
        this.sideContentResizeNode.style.setProperty('--sideContent-resize-background', "transparent")
        this.containerNode.appendChild(this.sideContentResizeNode);

        
        this.sideContents = [
            new Explorer(this.sideContentNode, this.settings)
        ]

        this.handleResize();

        this.selectedSideContent = null;
        eventhandler.connect("sidebar:elementSelected", async (buttonNode) => {
            for (let index = 0; index < this.sideContent.length; index++) {
                let element = this.sideContent[index];

                if (buttonNode == element.sidebarButtonNode) {
                    if (this.selectedSideContent !== null) {
                        this.selectedSideContent.hide();
                    }
                    this.selectedSideContent = element;
                    this.selectedSideContent.show();
                    return;
                }
            }
        });
        
        eventhandler.connect("sidebar.tabSelected", (tab) => {
            console.log("Tab selected");
            this.sideContents.forEach(sideContent => {
                console.log(sideContent.name, tab.name);
                if (tab.name === sideContent.name) {
                    console.log("show");
                    sideContent.show();
                }
                else {
                    sideContent.hide();
                }
            })
        });
    }

    handleResize() {
        this.isResizingSideContent = false;
        this.cursorInSideContentResize = false;

        document.addEventListener("mousemove", (event) => {
            let borderPosition = this.settings.sidebar.width + this.sideContentWidth;
            if (event.clientX >= borderPosition -3 && event.clientX <= borderPosition + 3) {
                if (!this.cursorInSideContentResize) {
                    document.body.style.cursor = "e-resize";
                    this.cursorInSideContentResize = true;
                }
            }
            else {
                if (this.cursorInSideContentResize && !this.isResizingSideContent) {
                    document.body.style.cursor = "default";
                    this.cursorInSideContentResize = false;
                }
            }

            if (this.isResizingSideContent) {
                borderPosition = Math.min(window.innerWidth / 2, Math.max(200, event.clientX));
                this.sideContentWidth = borderPosition - this.settings.sidebar.width;
                this.containerNode.style.setProperty("--sideContent-width", String(this.sideContentWidth)+"px");
                eventhandler.emit("sideContent.resized")
            }
        });

        document.addEventListener("mousedown", (event) => {
            if (this.cursorInSideContentResize) {
                this.isResizingSideContent = true;
                this.sideContentResizeNode.style.setProperty('--sideContent-resize-background', "rgb(101, 113, 163)")
            }
        });

        document.addEventListener("mouseup", (event) => {
            if (this.isResizingSideContent) {
                this.isResizingSideContent = false;
                this.sideContentResizeNode.style.setProperty('--sideContent-resize-background', "transparent")
                this.settings.sideContent.width = this.sideContentWidth;
                eventhandler.emit("settingsUpdated");
            }
        });

        // important to disable the cursor to change cursor to warning symbol and lagging
        document.addEventListener('dragstart', (event) => {
            event.preventDefault();
        });
    }
}