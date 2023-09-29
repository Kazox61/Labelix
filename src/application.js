import { EventHandler } from "./eventhandler.js";
import { Titlebar } from "./components/titlebar/titlebar.js";
import { Activitybar } from "./components/activitybar/activitybar.js";
import { Sidebar } from "./components/sidebar/sidebar.js";
import { Content } from "./components/content/content.js";
import { dracula } from "./preferences/theme/dracula.js";

export const eventhandler = new EventHandler();

export class Application {
    constructor() {
        
    }

    async start() {
        this.config = await window.electronAPI.loadConfig();
        if (this.config === null) {
            this.config = {
                activitybarWidth: 50,
                sidebarWidth: 250
            }
        }
        this.rootNode = document.querySelector(".root");
        this.updateColorTheme(dracula);

        this.titlebar = new Titlebar(this);
        this.activitybar = new Activitybar(this);
        this.sidebar = new Sidebar(this);
        this.mainContent = new Content(this);

        this.buildComponents();

        eventhandler.connect("configUpdated", () => window.electronAPI.saveConfig(this.config));
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

    updateColorTheme(colorTheme) {
        this.rootNode.style.setProperty("--foreground", colorTheme.style.foreground);
        
        this.rootNode.style.setProperty("--titlebar-background", colorTheme.style.titlebar.background);
        this.rootNode.style.setProperty("--dropdown-button-hover-background", colorTheme.style.titlebar.menubar.dropdown.buttonHoverBackground);
        this.rootNode.style.setProperty("--dropdown-content-background", colorTheme.style.titlebar.menubar.dropdown.content.background);
        this.rootNode.style.setProperty("--dropdown-content-element-hover-background", colorTheme.style.titlebar.menubar.dropdown.content.elementHoverBackground);

        this.rootNode.style.setProperty("--activitybar-background", colorTheme.style.activitybar.background);
        this.rootNode.style.setProperty("--activitybar-btn-selected-background", colorTheme.style.activitybar.buttonSelectedBackground);
        this.rootNode.style.setProperty("--activitybar-btn-svg-color", colorTheme.style.activitybar.buttonSVGColor);

        this.rootNode.style.setProperty("--sidebar-background", colorTheme.style.sidebar.background);
        this.rootNode.style.setProperty('--sidebar-resize-background', colorTheme.style.sidebar.resizeBackground);
        this.rootNode.style.setProperty("--explorer-project-header-background", colorTheme.style.sidebar.explorer.projectHeaderBackground);
        this.rootNode.style.setProperty("--explorer-element-selected-background", colorTheme.style.sidebar.explorer.elementSelectedBackground);
        this.rootNode.style.setProperty("--explorer-element-hover-background", colorTheme.style.sidebar.explorer.elementHoverBackground);

        this.rootNode.style.setProperty("--content-background", colorTheme.style.content.background);
    }
}