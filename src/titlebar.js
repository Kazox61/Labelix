import { Dropdown } from "./dropdown.js";

let titlebarCategories = [{
    "name": "File",
    "elements": [
        {
            "name": "Open Folder",
            "shortcut": ["Ctrl", "P"],
            "clickEvent": "titlebar:openFolder"
        },
        {
            "name": "Open Recent Project",
            "shortcut": ["Ctrl", "R"]
        },
    ]
}]

export class Titlebar {
    constructor(parentElement) {
        this.parentElement = parentElement
    }

    create() {
        this.createLeftTitlebar();
        this.createCenterTitlebar();
        this.createRightTitlebar();
    }

    createLeftTitlebar() {
        const leftTitlebar = document.createElement("div");
        leftTitlebar.classList.add("titlebar-left");
        this.parentElement.appendChild(leftTitlebar);

        titlebarCategories.forEach((category) => {
            let dropdown = new Dropdown(category);
            leftTitlebar.appendChild(dropdown.rootElement);
        });
    }

    createCenterTitlebar() {
        const centerTitlebar = document.createElement("div");
        centerTitlebar.classList.add("titlebar-center");
        this.parentElement.appendChild(centerTitlebar);
    }

    createRightTitlebar() {
        const rightTitlebar = document.createElement("div");
        rightTitlebar.classList.add("titlebar-right");
        this.parentElement.appendChild(rightTitlebar);

        const minimizeBtn = document.createElement("button");
        minimizeBtn.classList.add("window-controls");
        minimizeBtn.classList.add("window-minimize");
        minimizeBtn.innerHTML = '<svg width="15px" height="15px" viewBox="0 0 20 20" fill="none"><path d="M3 10 L17 10" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        minimizeBtn.addEventListener("click", () => {
            window.windowAPI.minimize();
        });
        rightTitlebar.appendChild(minimizeBtn);

        const maximizeBtn = document.createElement("button");
        maximizeBtn.classList.add("window-controls");
        maximizeBtn.classList.add("window-maximize");
        maximizeBtn.innerHTML = '<svg width="15px" height="15px" viewBox="0 0 20 20" fill="none"><path d="M3 17 L3 6 L14 6 L14 17 L3 17 M6 6 L6 3 L17 3 L17 14 L14 14" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        maximizeBtn.addEventListener("click", () => {
            window.windowAPI.maximize();
        });
        rightTitlebar.appendChild(maximizeBtn);

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("window-controls");
        closeBtn.classList.add("window-close");
        closeBtn.innerHTML = '<svg width="15px" height="15px" viewBox="0 0 20 20" fill="none"><path d="M3 17 L17 3 M3 3 L17 17" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        closeBtn.addEventListener("click", () => {
            window.windowAPI.close();
        });
        rightTitlebar.appendChild(closeBtn);
    }
    
}