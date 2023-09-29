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

        
        this.selectedsidebar = null;
        eventhandler.connect("activitybar.elementSelected", async (buttonNode) => {
            for (let index = 0; index < this.sidebar.length; index++) {
                let element = this.sidebar[index];

                if (buttonNode == element.activitybarButtonNode) {
                    if (this.selectedsidebar !== null) {
                        this.selectedsidebar.hide();
                    }
                    this.selectedsidebar = element;
                    this.selectedsidebar.show();
                    return;
                }
            }
        });
        
        eventhandler.connect("activitybar.tabSelected", (tab) => {
            this.sidebars.forEach(sidebar => {
                if (tab.name === sidebar.name) {
                    sidebar.show();
                }
                else {
                    sidebar.hide();
                }
            })
        });
    }

    handleResize() {
        this.isResizingsidebar = false;
        this.cursorInsidebarResize = false;

        document.addEventListener("mousemove", (event) => {
            let borderPosition = this.app.config.activitybarWidth + this.app.config.sidebarWidth;
            if (event.clientX >= borderPosition -3 && event.clientX <= borderPosition + 3) {
                if (!this.cursorInsidebarResize) {
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
                this.containerNode.style.setProperty("--sidebar-width", String(this.app.config.sidebarWidth)+"px");
                eventhandler.emit("sidebar.resized")
            }
        });

        document.addEventListener("mousedown", (event) => {
            if (this.cursorInsidebarResize) {
                this.isResizingsidebar = true;
                this.sidebarResizeNode.classList.add("selected");
            }
        });

        document.addEventListener("mouseup", (event) => {
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
}