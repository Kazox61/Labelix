export class UI {
    constructor(eventhandler) {
        this.eventhandler = eventhandler;
    }

    init(project) {
        this.canvas = document.querySelector("canvas")
        this.ctx = this.canvas.getContext("2d");
        this.secondary_sidebar = document.querySelector(".secondary-sidebar")
        this.main = document.querySelector(".main")
        this.sidebar_tab_explorer = document.getElementById("sidebar-tab-explorer")
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.cursor_in_sidebar_resize = false;
        this.is_resizing_sidebar = false;
        this.sidebar_border_position = 300;
        this.init_secondary_sidebar_resize();

        this.sidebar_tab_explorer.addEventListener("click", async () => {
            const { dirName, dirPath} = await window.electronAPI.openDirectory();
            project.init(dirName, dirPath, this);
        });
    }

    init_secondary_sidebar_resize() {
        document.addEventListener("mousemove", (event) => {
            if (event.clientX >= this.sidebar_border_position -3 && event.clientX <= this.sidebar_border_position + 3) {
                if (!this.cursor_in_sidebar_resize) {
                    document.body.style.cursor = "e-resize";
                    this.cursor_in_sidebar_resize = true;
                }
            }
            else {
                if (this.cursor_in_sidebar_resize && !this.is_resizing_sidebar) {
                    document.body.style.cursor = "default";
                    this.cursor_in_sidebar_resize = false;
                }
            }

            if (this.is_resizing_sidebar) {
                this.sidebar_border_position = Math.min(window.innerWidth / 2, Math.max(200, event.clientX));
                this.secondary_sidebar.style.width = String(this.sidebar_border_position - 50) + "px";
                this.main.style.marginLeft = String(this.sidebar_border_position) + "px";
                this.eventhandler.emit("sidebar-resize")
            }
        });

        document.addEventListener("mousedown", (event) => {
            if (this.cursor_in_sidebar_resize) {
                this.is_resizing_sidebar = true;
                this.secondary_sidebar.classList.add('highlighted-border')
            }
        });

        document.addEventListener("mouseup", (event) => {
            if (this.is_resizing_sidebar) {
                this.is_resizing_sidebar = false;
                this.secondary_sidebar.classList.remove('highlighted-border')
            }
        });

        // important to disable the cursor to change cursor to warning symbol and lagging
        document.addEventListener('dragstart', (event) => {
            event.preventDefault();
        });
    }
}