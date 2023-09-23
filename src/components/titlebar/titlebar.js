import { Menubar } from "./menu/menubar.js";
import { TitlebarRight } from "./titlebarRight.js";

export class Titlebar {
    constructor(rootNode, settings) {
        this.rootNode = rootNode;
        this.settings = settings;

        this.titlebarNode = document.createElement("div");
        this.titlebarNode.className = "titlebar";
        this.titlebarNode.style.setProperty("--titlebar-background", this.settings.titlebar.background);
        this.rootNode.appendChild(this.titlebarNode);

        this.menubar = new Menubar(this.titlebarNode, this.settings);
        this.titlebarRight = new TitlebarRight(this.titlebarNode);
    }
}