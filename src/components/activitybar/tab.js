import { eventhandler } from "../../application.js";

export class Tab {
    constructor(name, svg) {
        this.name = name;
        this.svg = svg;
    }

    build(activitybarNode) {
        this.activitybarNode = activitybarNode;

        this.tabButtonNode = document.createElement("button");
        this.tabButtonNode.className = "activitybar-btn";
        this.tabButtonNode.innerHTML = this.svg;
        this.activitybarNode.appendChild(this.tabButtonNode);
        this.tabButtonNode.addEventListener("click", () => {
            if (!this.isSelected) {
                this.selectTab();
            }
        });
    }

    selectTab() {
        this.tabButtonNode.classList.add("selected");
        
        eventhandler.emit("activitybar.tabSelected", this);
    }

    unselectTab() {
        this.tabButtonNode.classList.remove("selected");
    }
}