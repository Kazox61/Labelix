import { Menubar } from "./menu/menubar.js";
import { TitlebarRight } from "./titlebarRight.js";

export class Titlebar {
    constructor(app) {
        this.app = app;

        this.menubar = new Menubar();
        this.titlebarRight = new TitlebarRight();
    }

    build(rootNode) {
        this.rootNode = rootNode;
        this.titlebarNode = document.createElement("div");
        this.titlebarNode.className = "titlebar";
        this.rootNode.appendChild(this.titlebarNode);

        this.menubar.build(this.titlebarNode);
        this.titlebarRight.build(this.titlebarNode);
    }
}