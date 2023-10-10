import { LabelEditor } from "./labelEditor.js";
import { SettingsEditor } from "./settingsEditor.js";

export class Content {
    constructor(app) {
        this.app = app;
    }

    build(containerNode) {
        this.containerNode = containerNode;

        this.contentNode = document.createElement("div");
        this.contentNode.className = "content";
        this.containerNode.appendChild(this.contentNode);

        this.contentbarNode = document.createElement("div");
        this.contentbarNode.className = "contentbar";
        this.contentNode.appendChild(this.contentbarNode);

        this.contentContainerNode = document.createElement("div");
        this.contentContainerNode.className = "contentContainer";
        this.contentNode.appendChild(this.contentContainerNode);

        this.labelEditor = new LabelEditor(this.app, this.contentContainerNode, this.contentbarNode);
        this.labelEditor.buildTab();
        this.settingsEditor = new SettingsEditor(this.app, this.contentContainerNode, this.contentbarNode);
        this.settingsEditor.buildTab();
        this.selectContent(this.labelEditor);
    }

    selectContent(content) {
        if (this.selectedContent === content) return;
        if (this.selectedContent != null) {
            this.selectedContent.contentbarTabNode.classList.remove("selected");
            this.selectedContent.hide();
        };

        this.selectedContent = content;
        this.selectedContent.contentbarTabNode.classList.add("selected");
        this.selectedContent.show();
    }
}
