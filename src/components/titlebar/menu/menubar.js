import { Dropdown } from "./Dropdown.js";

export class Menubar {
    constructor() {
        this.fileDropdownContent = {
            "name": "File",
            "elements": [
                {
                    "name": "Open Folder",
                    "shortcut": ["ctrl", "o"],
                    "clickEventName": "titlebar.openFolder"
                }
            ]
        };
        this.fileDropdown = new Dropdown(this.fileDropdownContent);
    }

    build(titlebarNode) {
        this.titlebarNode = titlebarNode;
        
        this.menubarNode = document.createElement("div");
        this.menubarNode.className = "menubar";
        this.titlebarNode.appendChild(this.menubarNode);

        this.fileDropdown.build(this.menubarNode);
    }
}