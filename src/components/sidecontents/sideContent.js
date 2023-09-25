import { Explorer } from "./explorer.js";
import { eventhandler } from "../../application.js";
import { LabelList } from "./labelList.js";

export class SideContent {
    constructor(containerNode, settings, explorerButtonNode, labelListButtonNode) {
        this.containerNode = containerNode;
        this.settings = settings;
        this.sideContentSettings = this.settings.sideContent;
        this.sideContentWidth = this.settings.sideContent.width;

        this.sideContentNode = document.createElement("div");
        this.sideContentNode.className = "sideContent";
        this.sideContentNode.style.setProperty("--sideContent-background", this.sideContentSettings.background);
        this.sideContentNode.style.setProperty("--sideContent-width", String(this.sideContentSettings.width)+"px");
        this.containerNode.appendChild(this.sideContentNode);

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

        this.sideContent = [
            new Explorer(this.sideContentNode, settings, explorerButtonNode),
            new LabelList(this.sideContentNode, settings, labelListButtonNode)
        ];

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
                this.sideContentNode.style.setProperty("--sideContent-width", String(this.sideContentWidth)+"px");
                eventhandler.emit("sideContent:resize")
            }
        });

        document.addEventListener("mousedown", (event) => {
            if (this.cursorInSideContentResize) {
                this.isResizingSideContent = true;
                this.sideContentNode.classList.add('highlighted-border')
            }
        });

        document.addEventListener("mouseup", (event) => {
            if (this.isResizingSideContent) {
                this.isResizingSideContent = false;
                this.sideContentNode.classList.remove('highlighted-border')
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