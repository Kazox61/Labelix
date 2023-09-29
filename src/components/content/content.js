import { eventhandler } from "../../application.js";
import { LabelEditor } from "./labelEditor.js";

export class Content {
    constructor(app) {
        this.app = app;
    }

    build(containerNode) {
        this.containerNode = containerNode;

        this.contentNode = document.createElement("div");
        this.contentNode.className = "content";
        this.containerNode.appendChild(this.contentNode);

        this.LabelEditor = new LabelEditor(this.app, this.contentNode);
    }
}