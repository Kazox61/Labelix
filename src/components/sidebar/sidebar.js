import { eventhandler } from "../../application.js";
import { Explorer } from "./explorer.js";
import { ClassEditor } from "./classEditor.js";

export class Sidebar {
    constructor(app) {
        this.app = app;
        this.settings = this.app.settings;

        eventhandler.connect("colorThemeSelected", (colorTheme) => {
            
        })
    }

    build(containerNode) {
        this.containerNode = containerNode;
        this.sidebarSettings = this.settings.sidebar;
        this.sidebarWidth = this.settings.sidebar.width;

        this.sidebarNode = document.createElement("div");
        this.sidebarNode.className = "sidebar";
        this.sidebarNode.style.setProperty("--sidebar-background", this.sidebarSettings.background);
        this.containerNode.style.setProperty("--sidebar-width", String(this.sidebarSettings.width)+"px");
        this.containerNode.appendChild(this.sidebarNode);

        this.sidebarResizeNode = document.createElement("div");
        this.sidebarResizeNode.className = "sidebarResize";
        this.sidebarResizeNode.style.setProperty('--sidebar-resize-background', "transparent")
        this.containerNode.appendChild(this.sidebarResizeNode);

        this.explorer = new Explorer(this.sidebarNode, this.settings);
        this.classEditor = new ClassEditor(this.sidebarNode, this.settings);

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
            let borderPosition = this.settings.activitybar.width + this.sidebarWidth;
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
                this.sidebarWidth = borderPosition - this.settings.activitybar.width;
                this.containerNode.style.setProperty("--sidebar-width", String(this.sidebarWidth)+"px");
                eventhandler.emit("sidebar.resized")
            }
        });

        document.addEventListener("mousedown", (event) => {
            if (this.cursorInsidebarResize) {
                this.isResizingsidebar = true;
                this.sidebarResizeNode.style.setProperty('--sidebar-resize-background', "rgb(101, 113, 163)")
            }
        });

        document.addEventListener("mouseup", (event) => {
            if (this.isResizingsidebar) {
                this.isResizingsidebar = false;
                this.sidebarResizeNode.style.setProperty('--sidebar-resize-background', "transparent")
                this.settings.sidebar.width = this.sidebarWidth;
                eventhandler.emit("settingsUpdated");
            }
        });

        // important to disable the cursor to change cursor to warning symbol and lagging
        document.addEventListener('dragstart', (event) => {
            event.preventDefault();
        });
    }
}