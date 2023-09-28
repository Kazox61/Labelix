import { eventhandler } from "../../application.js";
import { Tab } from "./tab.js";

export class Activitybar {
    constructor(settings) {
        this.settings = settings;
        this.selectedTab = null;

        this.tabs = [
            new Tab(settings, "explorer", '<svg class="activitybar-btn-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="var(--activitybar-btn-svg-color)"><path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"/></svg>'),
            new Tab(settings, "classEditor", '<svg class="activitybar-btn-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z" stroke="var(--activitybar-btn-svg-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')
        ]
    }

    build(containerNode) {
        this.containerNode = containerNode;

        this.activitybarNode = document.createElement("div");
        this.activitybarNode.className = "activitybar";
        this.containerNode.style.setProperty("--activitybar-width", String(this.settings.activitybar.width)+"px");
        this.activitybarNode.style.setProperty("--activitybar-background", this.settings.activitybar.background);
        this.activitybarNode.style.setProperty("--activitybar-btn-selected-background", this.settings.activitybar.buttonSelectedBackground);
        this.containerNode.appendChild(this.activitybarNode);

        this.tabs.forEach(tab => {
            tab.build(this.activitybarNode);
        })

        eventhandler.connect("activitybar.tabSelected", (selectedTab) => {
            if (this.selectedTab != null) {
                this.selectedTab.unselectTab();
            }
            this.selectedTab = selectedTab;
        });

        eventhandler.connect("componentsBuilt", () => {
            this.tabs[0].selectTab();
        });
    }

    
}