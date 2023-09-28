import { EventHandler } from "./eventhandler.js";
import { Titlebar } from "./components/titlebar/titlebar.js";
import { Activitybar } from "./components/activitybar/activitybar.js";
import { Sidebar } from "./components/sidebar/sidebar.js";
import { Content } from "./components/content/content.js";

export const eventhandler = new EventHandler();

export class Application {
    constructor() {
        
    }

    async start() {
        this.settings = await window.electronAPI.getSettings();
        
        this.rootNode = document.querySelector(".root");
        this.rootNode.style.setProperty("--default-foreground", this.settings.defaultForeground);

        this.titlebar = new Titlebar(this);
        this.activitybar = new Activitybar(this);
        this.sidebar = new Sidebar(this);
        this.mainContent = new Content(this);

        this.buildComponents();
    }


    buildComponents() {
        this.titlebar.build(this.rootNode);

        this.containerNode = document.createElement("div");
        this.containerNode.className = "container";
        this.rootNode.appendChild(this.containerNode);

        this.activitybar.build(this.containerNode);
        this.sidebar.build(this.containerNode);
        this.mainContent.build(this.containerNode);

        eventhandler.emit("componentsBuilt");
    }
}