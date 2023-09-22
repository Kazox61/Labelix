let this.cursorInSidebarResize = false;
let this.isResizingSidebar = false;
let borderPosition;

export function handleContentResize(sideContentNode, mainContentNode, settings) {
    const root = document.querySelector(":root");
    let sideContentWidth = settings.sideContentWidth;
    let sidebarWidth = settings.sidebarWidth;
    document.addEventListener("mousemove", (event) => {
        borderPosition = sideContentWidth + sidebarWidth;
        if (event.clientX >= borderPosition -3 && event.clientX <= borderPosition + 3) {
            
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
            borderPosition = Math.min(window.innerWidth / 2, Math.max(200, event.clientX));
            root.style.setProperty("--sideContent-width", );
            //eventhandler.emit("sidebar-resize")
        }
    });

    document.addEventListener("mousedown", (event) => {
        if (this.cursorInSidebarResize) {
            this.isResizingSidebar = true;
            sideContentNode.classList.add('highlighted-border')
        }
    });

    document.addEventListener("mouseup", (event) => {
        if (this.isResizingSidebar) {
            this.isResizingSidebar = false;
            sideContentNode.classList.remove('highlighted-border')
        }
    });

    // important to disable the cursor to change cursor to warning symbol and lagging
    document.addEventListener('dragstart', (event) => {
        event.preventDefault();
    });
}