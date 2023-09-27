import { EventHandler } from "./eventhandler.js";
import { Titlebar } from "./components/titlebar/titlebar.js";
import { Sidebar } from "./components/sidebar/sidebar.js";
import { SideContent } from "./components/sideContent/sideContent.js";
import { MainContent } from "./components/mainContent/mainContent.js";

export const eventhandler = new EventHandler();

export class Application {
    constructor() {
        
    }

    async start() {
        this.settings = await window.electronAPI.getSettings();
        
        this.rootNode = document.querySelector(".root");
        this.rootNode.style.setProperty("--default-foreground", this.settings.defaultForeground);

        this.titlebar = new Titlebar(this.settings);
        this.sidebar = new Sidebar(this.settings);
        this.sideContent = new SideContent(this.settings);
        this.mainContent = new MainContent(this.settings);

        this.buildComponents();
    }


    buildComponents() {
        this.titlebar.build(this.rootNode);

        this.containerNode = document.createElement("div");
        this.containerNode.className = "container";
        this.rootNode.appendChild(this.containerNode);

        this.sidebar.build(this.containerNode);
        this.sideContent.build(this.containerNode);
        this.mainContent.build(this.containerNode);

        eventhandler.emit("componentsBuilt");
    }
}