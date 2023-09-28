import { eventhandler } from "../../application.js";

export class Tab {
    constructor(settings, name, svg) {
        this.settings = settings;
        this.name = name;
        this.svg = svg;
        this.isSelected = false;
    }

    build(activitybarNode) {
        this.activitybarNode = activitybarNode;

        this.tabButtonNode = document.createElement("button");
        this.tabButtonNode.className = "activitybar-btn";
        this.tabButtonNode.style.setProperty("--activitybar-btn-svg-color", this.settings.activitybar.buttonSVGColor);
        this.tabButtonNode.innerHTML = this.svg;
        this.activitybarNode.appendChild(this.tabButtonNode);
        this.tabButtonNode.addEventListener("click", () => {
            if (!this.isSelected) {
                this.selectTab();
            }
        });
        this.tabButtonNode.addEventListener("mouseenter", () => {
            this.tabButtonNode.style.setProperty("--activitybar-btn-svg-color", "#ffffff");
        });
        this.tabButtonNode.addEventListener("mouseleave", () => {
            if (!this.isSelected) {
                this.tabButtonNode.style.setProperty("--activitybar-btn-svg-color", this.settings.activitybar.buttonSVGColor);
            }
        });
    }

    selectTab() {
        this.isSelected = true;
        this.tabButtonNode.style.setProperty("--activitybar-btn-svg-color", "#ffffff");
        this.tabButtonNode.classList.add("selected");
        
        eventhandler.emit("activitybar.tabSelected", this);
    }

    unselectTab() {
        this.isSelected = false;
        this.tabButtonNode.classList.remove("selected");
        this.tabButtonNode.style.setProperty("--activitybar-btn-svg-color", this.settings.activitybar.buttonSVGColor);
    }
}