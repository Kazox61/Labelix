import { eventhandler } from "../../application.js";
import { Tab } from "./tab.js";

const explorerIcon = '<svg class="action-label" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"/></svg>';
const classEditorIcon = '<svg class="action-label" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6L21 6.00078M8 12L21 12.0008M8 18L21 18.0007M3 6.5H4V5.5H3V6.5ZM3 12.5H4V11.5H3V12.5ZM3 18.5H4V17.5H3V18.5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export class Activitybar {
    constructor(app) {
        this.app = app;
        this.selectedTab = null;

        this.tabs = [
            new Tab("explorer", explorerIcon),
            new Tab("classEditor", classEditorIcon)
        ]
    }

    build(containerNode) {
        this.containerNode = containerNode;

        this.activitybarNode = document.createElement("div");
        this.activitybarNode.className = "activitybar";
        this.containerNode.style.setProperty("--activitybar-width", String(this.app.config.activitybarWidth)+"px");
        this.containerNode.appendChild(this.activitybarNode);

        this.tabs.forEach(tab => {
            tab.build(this.activitybarNode);
        })

        eventhandler.connect("activitybar.tabSelected", (selectedTab) => {
            if (this.selectedTab != null) {
                if (this.selectedTab === selectedTab) {
                    this.app.sidebar.setSidebarWidth(0);
                    this.selectedTab.unselectTab();
                    this.selectedTab = null;
                }
                else {
                    this.selectedTab.unselectTab();
                    this.selectedTab = selectedTab;
                    this.selectedTab.tabButtonNode.classList.add("selected");
                    this.app.sidebar.setSidebarWidth(this.app.config.sidebarWidth);
                }
            }
            else {
                this.selectedTab = selectedTab;
                this.selectedTab.tabButtonNode.classList.add("selected");
                this.app.sidebar.setSidebarWidth(this.app.config.sidebarWidth);
            }
            this.app.sidebar.selectSidebar(this.selectedTab);
        });

        eventhandler.connect("componentsBuilt", () => {
            this.tabs[0].selectTab();
        });
    }

    
}