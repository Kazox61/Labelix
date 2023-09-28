import { Menubar } from "./menu/menubar.js";
import { TitlebarRight } from "./titlebarRight.js";

export class Titlebar {
    constructor(app) {
        this.app = app;
        this.settings = this.app.settings;

        this.menubar = new Menubar(this.settings);
        this.titlebarRight = new TitlebarRight(this.titlebarNode);
    }

    build(rootNode) {
        this.rootNode = rootNode;
        this.titlebarNode = document.createElement("div");
        this.titlebarNode.className = "titlebar";
        this.titlebarNode.style.setProperty("--titlebar-background", this.settings.titlebar.background);
        this.rootNode.appendChild(this.titlebarNode);

        this.menubar.build(this.titlebarNode);
        this.titlebarRight.build(this.titlebarNode);
    }
}