export class Sidebar {
    constructor(containerNode, settings) {
        this.containerNode = containerNode;
        this.settings = settings;

        this.sidebarNode = document.createElement("div");
        this.sidebarNode.className = "sidebar";
        this.sidebarNode.style.setProperty("--sidebar-width", String(this.settings.sidebar.width)+"px");
        this.sidebarNode.style.setProperty("--sidebar-background", this.settings.sidebar.background);
        this.containerNode.appendChild(this.sidebarNode);
    }
}