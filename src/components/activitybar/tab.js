import { eventhandler } from "../../application.js";

export class Tab {
    constructor(name, svg) {
        this.name = name;
        this.svg = svg;
    }

    build(activitybarNode) {
        this.activitybarNode = activitybarNode;

        this.tabButtonNode = document.createElement("div");
        this.tabButtonNode.className = "action-item";
        this.tabButtonNode.innerHTML = this.svg;
        this.activitybarNode.appendChild(this.tabButtonNode);
        this.tabButtonNode.addEventListener("click", () => {
            if (!this.isSelected) {
                this.selectTab();
            }
        });
    }

    selectTab() {        
        eventhandler.emit("activitybar.tabSelected", this);
    }

    unselectTab() {
        this.tabButtonNode.classList.remove("selected");
    }
}