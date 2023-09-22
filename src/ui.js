import { Titlebar } from "./titlebar.js";
import { eventhandler } from "./labelix.js";

export class UI {
    constructor() {

    }

    init(settings) {
        this.canvas = document.querySelector("canvas")
        this.ctx = this.canvas.getContext("2d");
        this.secondarySidebar = document.querySelector(".secondary-sidebar")
        this.main = document.querySelector(".main")
        this.sidebar_tab_explorer = document.getElementById("sidebar-tab-explorer")
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.titlebar = new Titlebar(document.querySelector(".titlebar"));
        this.titlebar.create();

        this.cursorInSidebarResize = false;
        this.isResizingSidebar = false;
        this.sidebarBorderPosition = settings.sidebarBorderPosition;
        this.secondarySidebar.style.width = String(this.sidebarBorderPosition - 50) + "px";
        this.main.style.marginLeft = String(this.sidebarBorderPosition) + "px";
        this.initSecondarySidebarResize();
    }

    initSecondarySidebarResize() {
        document.addEventListener("mousemove", (event) => {
            if (event.clientX >= this.sidebarBorderPosition -3 && event.clientX <= this.sidebarBorderPosition + 3) {
                if (!this.cursorInSidebarResize) {
                    document.body.style.cursor = "e-resize";
                    this.cursorInSidebarResize = true;
                }
            }
            else {
                if (this.cursorInSidebarResize && !this.isResizingSidebar) {
                    document.body.style.cursor = "default";
                    this.cursorInSidebarResize = false;
                }
            }

            if (this.isResizingSidebar) {
                this.sidebarBorderPosition = Math.min(window.innerWidth / 2, Math.max(200, event.clientX));
                this.secondarySidebar.style.width = String(this.sidebarBorderPosition - 50) + "px";
                this.main.style.marginLeft = String(this.sidebarBorderPosition) + "px";
                eventhandler.emit("sidebar-resize")
            }
        });

        document.addEventListener("mousedown", (event) => {
            if (this.cursorInSidebarResize) {
                this.isResizingSidebar = true;
                this.secondarySidebar.classList.add('highlighted-border')
            }
        });

        document.addEventListener("mouseup", (event) => {
            if (this.isResizingSidebar) {
                this.isResizingSidebar = false;
                this.secondarySidebar.classList.remove('highlighted-border')
            }
        });

        // important to disable the cursor to change cursor to warning symbol and lagging
        document.addEventListener('dragstart', (event) => {
            event.preventDefault();
        });
    }
}