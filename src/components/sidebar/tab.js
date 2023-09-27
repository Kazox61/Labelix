import { eventhandler } from "../../application.js";

export class Tab {
    constructor(settings, name, svg) {
        this.settings = settings;
        this.name = name;
        this.svg = svg;
        this.isSelected = false;
    }

    build(sidebarNode) {
        this.sidebarNode = sidebarNode;

        this.tabButtonNode = document.createElement("button");
        this.tabButtonNode.className = "sidebar-btn";
        this.tabButtonNode.style.setProperty("--sidebar-btn-svg-color", this.settings.sidebar.buttonSVGColor);
        this.tabButtonNode.innerHTML = this.svg;
        this.sidebarNode.appendChild(this.tabButtonNode);
        this.tabButtonNode.addEventListener("click", () => {
            if (!this.isSelected) {
                this.selectTab();
            }
        });
        this.tabButtonNode.addEventListener("mouseenter", () => {
            this.tabButtonNode.style.setProperty("--sidebar-btn-svg-color", "#ffffff");
        });
        this.tabButtonNode.addEventListener("mouseleave", () => {
            if (!this.isSelected) {
                this.tabButtonNode.style.setProperty("--sidebar-btn-svg-color", this.settings.sidebar.buttonSVGColor);
            }
        });
    }

    selectTab() {
        this.isSelected = true;
        this.tabButtonNode.style.setProperty("--sidebar-btn-svg-color", "#ffffff");
        this.tabButtonNode.classList.add("selected");
        
        eventhandler.emit("sidebar.tabSelected", this);
        eventhandler.emit("sidebar.tabSelected." + this.name);
    }

    unselectTab() {
        this.isSelected = false;
        this.tabButtonNode.classList.remove("selected");
        this.tabButtonNode.style.setProperty("--sidebar-btn-svg-color", this.settings.sidebar.buttonSVGColor);
    }
}