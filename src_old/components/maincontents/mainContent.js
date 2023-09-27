import { eventhandler } from "../../application.js";
import { Labelix } from "./labelix.js";

export class MainContent {
    constructor(containerNode, settings) {
        this.containerNode = containerNode;
        this.settings = settings;

        this.mainContentNode = document.createElement("div");
        this.mainContentNode.className = "mainContent";
        this.mainContentNode.style.setProperty("--mainContent-background", this.settings.mainContent.background);
        this.containerNode.appendChild(this.mainContentNode);

        this.labelix = new Labelix(this.mainContentNode);
    }
}