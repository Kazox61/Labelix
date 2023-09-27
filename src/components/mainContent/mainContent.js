import { eventhandler } from "../../application.js";

export class MainContent {
    constructor(settings) {
        this.settings = settings;
    }

    build(containerNode) {
        this.containerNode = containerNode;

        this.mainContentNode = document.createElement("div");
        this.mainContentNode.className = "mainContent";
        this.mainContentNode.style.setProperty("--mainContent-background", this.settings.mainContent.background);
        this.containerNode.appendChild(this.mainContentNode);
    }
}