import { Dropdown } from "./Dropdown.js";

export class Menubar {
    constructor(titlebarNode) {
        this.titlebarNode = titlebarNode;

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
        this.fileDropdown = new Dropdown(this.menubarNode, this.fileDropdownContent);
    }
}