export class Sidebar {
    constructor(containerNode) {
        this.containerNode = containerNode;

        this.sidebarNode = document.createElement("div");
        this.sidebarNode.className = "sidebar";
        this.containerNode.appendChild(this.sidebarNode);
    }
}