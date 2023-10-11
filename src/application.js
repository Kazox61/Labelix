import "./mousetrap.js"
import { EventHandler } from "./eventhandler.js";
import { KeyboardShortcuts } from "./keyboardShortcuts.js";

import { Titlebar } from "./components/titlebar/titlebar.js";
import { Activitybar } from "./components/activitybar/activitybar.js";
import { Sidebar } from "./components/sidebar/sidebar.js";
import { Content } from "./components/content/content.js";
import { dracula } from "./preferences/theme/dracula.js";
import { ContextMenu } from "./contextMenu/contextMenu.js";

export const eventhandler = new EventHandler();

export class Application {
    constructor() {
        this.keyboardShortcuts = new KeyboardShortcuts();
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
        this.updateColorTheme(JSON.parse('{"name":"Monokai Pro","category":"dark","style":{"foreground":"#fcfcfa","titlebar":{"background":"#221f22","menubar":{"dropdown":{"buttonHoverBackground":"#4f4b5e","content":{"background":"#2d2a2e","elementHoverBackground":"#7d779c"}}}},"activitybar":{"background":"#19181a","foreground":"#5b595c","selectedForeground":"#fcfcfa"},"sidebar":{"background":"#221f22","resizeBackground":"#727072","sectionHeaderBackground":"#221f22"},"content":{"containerBackground":"#2d2a2e"},"colorPicker":{"background":"#2d2a2e","bordercolors":"#727072","markerSV":"#ffffff","markerHue":"#ffffff"},"list":{"selectedBackground":"#fcfcfa0c","hoverBackground":"#fcfcfa0c"},"selectedBackground":"#c1c0c026","input":{"background":"#403e41","foreground":"#fcfcfa","border":"#403e41","placeholderForeground":"#727072","focusBorder":"#727072"},"button":{"background":"#403e41","foreground":"#c1c0c0","hoverBackground":"#5b595c"}}}'));

        
        this.contextMenu = new ContextMenu();

        this.titlebar = new Titlebar(this);
        this.activitybar = new Activitybar(this);
        this.sidebar = new Sidebar(this);
        this.content = new Content(this);

        this.buildComponents();

        eventhandler.connect("configUpdated", () => window.electronAPI.saveConfig(this.config));

        this.keyboardShortcuts.init(this);
    }


    buildComponents() {
        this.titlebar.build(this.rootNode);

        this.containerNode = document.createElement("div");
        this.containerNode.className = "container";
        this.rootNode.appendChild(this.containerNode);

        this.activitybar.build(this.containerNode);
        this.sidebar.build(this.containerNode);
        this.content.build(this.containerNode);

        eventhandler.emit("componentsBuilt");
    }

    updateColorTheme(colorTheme) {
        this.rootNode.style.setProperty("--foreground", colorTheme.style.foreground);
        
        this.rootNode.style.setProperty("--titlebar-background", colorTheme.style.titlebar.background);
        this.rootNode.style.setProperty("--dropdown-button-hover-background", colorTheme.style.titlebar.menubar.dropdown.buttonHoverBackground);
        this.rootNode.style.setProperty("--dropdown-content-background", colorTheme.style.titlebar.menubar.dropdown.content.background);
        this.rootNode.style.setProperty("--dropdown-content-element-hover-background", colorTheme.style.titlebar.menubar.dropdown.content.elementHoverBackground);

        this.rootNode.style.setProperty("--activitybar-background", colorTheme.style.activitybar.background);
        this.rootNode.style.setProperty("--activitybar-foreground", colorTheme.style.activitybar.foreground);
        this.rootNode.style.setProperty("--activitybar-selected-background", colorTheme.style.activitybar.selectedBackground);
        this.rootNode.style.setProperty("--activitybar-selected-foreground", colorTheme.style.activitybar.selectedForeground);

        this.rootNode.style.setProperty("--sidebar-background", colorTheme.style.sidebar.background);
        this.rootNode.style.setProperty('--sidebar-resize-background', colorTheme.style.sidebar.resizeBackground);
        this.rootNode.style.setProperty('--sidebar-section-header-background', colorTheme.style.sidebar.sectionHeaderBackground);

        this.rootNode.style.setProperty("--content-container-background", colorTheme.style.content.containerBackground);

        this.rootNode.style.setProperty("--colorPicker-background", colorTheme.style.colorPicker.background);
        this.rootNode.style.setProperty("--colorPicker-borderColor", colorTheme.style.colorPicker.borderColor);
        this.rootNode.style.setProperty("--colorPicker-markerSV", colorTheme.style.colorPicker.markerSV);
        this.rootNode.style.setProperty("--colorPicker-markerHue", colorTheme.style.colorPicker.markerHue);

        this.rootNode.style.setProperty("--list-selected-background", colorTheme.style.list.selectedBackground);
        this.rootNode.style.setProperty("--list-hover-background", colorTheme.style.list.hoverBackground);

        this.rootNode.style.setProperty("--selected-background", colorTheme.style.selectedBackground);

        this.rootNode.style.setProperty("--input-background", colorTheme.style.input.background);
        this.rootNode.style.setProperty("--input-foreground", colorTheme.style.input.foreground);
        this.rootNode.style.setProperty("--input-border", colorTheme.style.input.border);
        this.rootNode.style.setProperty("--input-placeholder-foreground", colorTheme.style.input.placeholderForeground);
        this.rootNode.style.setProperty("--input-focus-border", colorTheme.style.input.focusBorder);

        this.rootNode.style.setProperty("--button-background", colorTheme.style.button.background);
        this.rootNode.style.setProperty("--button-foreground", colorTheme.style.button.foreground);
        this.rootNode.style.setProperty("--button-hover-background", colorTheme.style.button.hoverBackground);
    }
}