export class TitlebarRight {
    constructor() {
    }

    build(titlebarNode) {
        this.titlebarNode = titlebarNode;

        this.titlebarRightNode = document.createElement("div");
        this.titlebarRightNode.className = "titlebar-right";
        this.titlebarNode.appendChild(this.titlebarRightNode);
    }
}