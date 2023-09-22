import { Menubar } from "./menu/menubar.js";
import { TitlebarRight } from "./titlebarRight.js";

export class Titlebar {
    constructor() {
        this.parentNode = document.querySelector(".root");

        this.titlebarNode = document.createElement("div");
        this.titlebarNode.className = "titlebar";
        this.parentNode.appendChild(this.titlebarNode);

        this.menubar = new Menubar(this.titlebarNode);
        this.titlebarRight = new TitlebarRight(this.titlebarNode);
    }
}