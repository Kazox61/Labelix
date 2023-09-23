import { Dropdown } from "./Dropdown.js";

export class Menubar {
    constructor(titlebarNode, settings) {
        this.titlebarNode = titlebarNode;
        this.settings = settings;

        this.menubarNode = document.createElement("div");
        this.menubarNode.className = "menubar";
        this.titlebarNode.appendChild(this.menubarNode);


        this.fileDropdownContent = {
            "name": "File",
            "elements": [
                {
                    "name": "Open Folder",
                    "shortcut": ["Ctrl", "P"],
                    "clickEventName": "tb:openFolder"
                }
            ]
        };
        this.fileDropdown = new Dropdown(this.menubarNode, this.settings, this.fileDropdownContent);
    }
}