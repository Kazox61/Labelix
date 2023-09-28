import { eventhandler } from "../../application.js";
import { LabelEditor } from "./labelEditor.js";

export class Content {
    constructor(app) {
        this.app = app;
        this.settings = this.app.settings;
    }

    build(containerNode) {
        this.containerNode = containerNode;

        this.contentNode = document.createElement("div");
        this.contentNode.className = "content";
        this.contentNode.style.setProperty("--content-background", this.settings.content.background);
        this.containerNode.appendChild(this.contentNode);

        this.LabelEditor = new LabelEditor(this.app, this.contentNode);
    }
}