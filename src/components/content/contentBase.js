export class ContentBase {
    constructor(app, contentContainerNode, contentbarNode) {
        this.app = app;
        this.contentContainerNode = contentContainerNode;
        this.contentbarNode = contentbarNode;
        this.isHidden = true;
    }

    buildTab() {
        this.contentbarTabNode = document.createElement("div");
        this.contentbarTabNode.className = "tabContainer";
        this.contentbarNode.appendChild(this.contentbarTabNode);
        this.contentbarTabNode.addEventListener("click", () => {
            this.app.content.selectContent(this);
        });

        const tabNameNode = document.createElement("div");
        tabNameNode.className = "tabName";
        tabNameNode.innerText = this.name;
        this.contentbarTabNode.appendChild(tabNameNode);
    }

    show() {
        this.isHidden = false;
    }

    hide() {
        this.isHidden = true;
        this.contentContainerNode.replaceChildren();
    }
}