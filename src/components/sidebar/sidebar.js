import { eventhandler } from "../../application.js";
import { Explorer } from "./explorer.js";
import { ClassEditor } from "./classEditor.js";

export class Sidebar {
    constructor(app) {
        this.app = app;
    }

    build(containerNode) {
        this.containerNode = containerNode;

        this.sidebarNode = document.createElement("div");
        this.sidebarNode.className = "sidebar";
        this.containerNode.style.setProperty("--sidebar-width", String(this.app.config.sidebarWidth)+"px");
        this.containerNode.appendChild(this.sidebarNode);

        this.sidebarResizeNode = document.createElement("div");
        this.sidebarResizeNode.className = "sidebarResize";
        this.containerNode.appendChild(this.sidebarResizeNode);

        this.explorer = new Explorer(this.app, this.sidebarNode);
        this.classEditor = new ClassEditor(this.app, this.sidebarNode);

        this.sidebars = [
            this.explorer, this.classEditor
        ]

        this.handleResize();

        
        this.selectedSidebar = null;
    }

    handleResize() {
        this.isResizingsidebar = false;
        this.cursorInsidebarResize = false;

        document.addEventListener("mousemove", (event) => {
            let borderPosition = this.app.config.activitybarWidth + this.app.config.sidebarWidth;
            if (event.clientX >= borderPosition -3 && event.clientX <= borderPosition + 3) {
                const isInForeground = event.target === this.sidebarResizeNode || this.sidebarResizeNode.contains(event.target);
                if (!this.cursorInsidebarResize && isInForeground) {
                    document.body.style.cursor = "e-resize";
                    this.cursorInsidebarResize = true;
                }
            }
            else {
                if (this.cursorInsidebarResize && !this.isResizingsidebar) {
                    document.body.style.cursor = "default";
                    this.cursorInsidebarResize = false;
                }
            }

            if (this.isResizingsidebar) {
                borderPosition = Math.min(window.innerWidth / 2, Math.max(200, event.clientX));
                this.app.config.sidebarWidth = borderPosition - this.app.config.activitybarWidth;
                this.setSidebarWidth(this.app.config.sidebarWidth);
            }
        });

        document.addEventListener("mousedown", () => {
            if (this.cursorInsidebarResize) {
                this.isResizingsidebar = true;
                this.sidebarResizeNode.classList.add("selected");
            }
        });

        document.addEventListener("mouseup", () => {
            if (this.isResizingsidebar) {
                this.isResizingsidebar = false;
                this.sidebarResizeNode.classList.remove("selected");
                eventhandler.emit("configUpdated");
            }
        });

        // important to disable the cursor to change cursor to warning symbol and lagging
        document.addEventListener('dragstart', (event) => {
            event.preventDefault();
        });
    }

    selectSidebar(tab) {
        if (this.selectedSidebar != null) this.selectedSidebar.hide();
        if (tab === null) {
            this.selectedSidebar === null;
            return;
        }
        this.sidebars.forEach(sidebar => {
            if (tab.name === sidebar.name) this.selectedSidebar = sidebar;
        })
        this.selectedSidebar.show();
    }

    setSidebarWidth(width) {
        this.containerNode.style.setProperty("--sidebar-width", String(width)+"px");
        eventhandler.emit("sidebar.resized")
    }
}