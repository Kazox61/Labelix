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
        this.rootNode = document.querySelector(".root");
        this.rootNode.style.setProperty("--default-foreground", this.settings.defaultForeground);

        this.titlebar = new Titlebar(this.rootNode, this.settings);

        this.containerNode = document.createElement("div");
        this.containerNode.className = "container";

        document.querySelector(".root").appendChild(this.containerNode);

        this.sidebar = new Sidebar(this.containerNode, this.settings);
        this.sideContent = new SideContent(this.containerNode, this.settings, this.sidebar.explorerButtonNode, this.sidebar.labelListButtonNode);
        this.mainContent = new MainContent(this.containerNode, this.settings);
        this.sidebar.select(this.sidebar.explorerButtonNode)

        eventhandler.connect("settingsUpdated", () => this.onSettingsUpdated())

        eventhandler.emit("components:created");
    }

    async loadSettings() {
        this.settings = await window.electronAPI.getSettings();
    }

    onSettingsUpdated() {
        window.electronAPI.saveSettings(this.settings);
    }
}