import { EventHandler } from "./eventhandler.js";
import { Titlebar } from "./components/titlebar/titlebar.js";
import { Sidebar } from "./components/sidebar.js";
import { SideContent } from "./components/sidecontents/sideContent.js";
import { MainContent } from "./components/maincontents/mainContent.js";

export const eventhandler = new EventHandler();

export class Application {
    constructor() {
        
    }

    async start() {
        await this.loadSettings();
        this.titlebar = new Titlebar();

        this.containerNode = document.createElement("div");
        this.containerNode.className = "container";
        document.querySelector(".root").appendChild(this.containerNode);

        this.sidebar = new Sidebar(this.containerNode);
        this.sideContent = new SideContent(this.containerNode, this.settings);
        this.mainContent = new MainContent(this.containerNode);
    }

    async loadSettings() {
        this.settings = await window.electronAPI.getSettings();
    }
}