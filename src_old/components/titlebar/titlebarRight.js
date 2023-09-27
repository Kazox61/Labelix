export class TitlebarRight {
    constructor(titlebarNode) {
        this.titlebarNode = titlebarNode;

        this.titlebarRightNode = document.createElement("div");
        this.titlebarRightNode.className = "titlebar-right";
        this.titlebarNode.appendChild(this.titlebarRightNode);
    }
}