import { eventhandler } from "../../application.js";
import { Labelix } from "./labelix.js";

export class MainContent {
    constructor(containerNode) {
        this.containerNode = containerNode;

        this.mainContentNode = document.createElement("div");
        this.mainContentNode.className = "mainContent";
        this.containerNode.appendChild(this.mainContentNode);

        this.labelix = new Labelix(this.mainContentNode);

    }
}