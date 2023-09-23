import { Explorer } from "./explorer.js";
import { eventhandler } from "../../application.js";

export class SideContent {
    constructor(containerNode, settings) {
        this.containerNode = containerNode;
        this.sideContentWidth = settings.sideContentWidth;
        this.sidebarWidth = settings.sidebarWidth;

        this.sideContentNode = document.createElement("div");
        this.sideContentNode.className = "sideContent";
        this.containerNode.appendChild(this.sideContentNode);

        this.handleResize();

        this.explorer = new Explorer(this.sideContentNode);

    }

    handleResize() {
        const root = document.querySelector(":root");
        this.isResizingSideContent = false;
        this.cursorInSideContentResize = false;

        document.addEventListener("mousemove", (event) => {
            let borderPosition = this.sidebarWidth + this.sideContentWidth;
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
                this.sideContentWidth = borderPosition - this.sidebarWidth;
                root.style.setProperty("--sideContent-width", String(this.sideContentWidth)+"px");
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
            }
        });

        // important to disable the cursor to change cursor to warning symbol and lagging
        document.addEventListener('dragstart', (event) => {
            event.preventDefault();
        });
    }
}