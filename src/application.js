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
        this.themes = await window.electronAPI.getThemes();
        this.updateColorTheme(this.themes[0]);
        
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
        console.log(colorTheme.name);
        this.rootNode.style.setProperty("--foreground", colorTheme.style.foreground);
        
        this.rootNode.style.setProperty("--titlebar-background", colorTheme.style.titlebar.background);
        this.rootNode.style.setProperty("--titlebar-foreground", colorTheme.style.titlebar.foreground);
        this.rootNode.style.setProperty("--titlebar-border", colorTheme.style.titlebar.border);
        this.rootNode.style.setProperty("--dropdown-button-hover-background", colorTheme.style.titlebar.menubar.dropdown.buttonHoverBackground);
        this.rootNode.style.setProperty("--dropdown-content-background", colorTheme.style.titlebar.menubar.dropdown.content.background);
        this.rootNode.style.setProperty("--dropdown-content-element-hover-background", colorTheme.style.titlebar.menubar.dropdown.content.elementHoverBackground);
        
        this.rootNode.style.setProperty("--activitybar-border", colorTheme.style.activitybar.border);
        this.rootNode.style.setProperty("--activitybar-background", colorTheme.style.activitybar.background);
        this.rootNode.style.setProperty("--activitybar-foreground", colorTheme.style.activitybar.foreground);
        this.rootNode.style.setProperty("--activitybar-selected-background", colorTheme.style.activitybar.selectedBackground);
        this.rootNode.style.setProperty("--activitybar-selected-foreground", colorTheme.style.activitybar.selectedForeground);
        this.rootNode.style.setProperty("--activitybar-selected-border", colorTheme.style.activitybar.selectedBorder);

        this.rootNode.style.setProperty("--sidebar-border", colorTheme.style.sidebar.border);
        this.rootNode.style.setProperty("--sidebar-background", colorTheme.style.sidebar.background);
        this.rootNode.style.setProperty('--sidebar-resize-background', colorTheme.style.sidebar.resizeBackground);
        this.rootNode.style.setProperty('--sidebar-section-header-background', colorTheme.style.sidebar.sectionHeaderBackground);

        this.rootNode.style.setProperty("--content-container-background", colorTheme.style.content.containerBackground);

        this.rootNode.style.setProperty("--content-tab-foreground", colorTheme.style.content.tab.foreground);
        this.rootNode.style.setProperty("--content-tab-border", colorTheme.style.content.tab.border);
        this.rootNode.style.setProperty("--content-tab-background", colorTheme.style.content.tab.background);
        this.rootNode.style.setProperty("--content-tab-hover-background", colorTheme.style.content.tab.hoverBackground);
        this.rootNode.style.setProperty("--content-tab-selected-foreground", colorTheme.style.content.tab.selectedForeground);
        this.rootNode.style.setProperty("--content-tab-selected-border", colorTheme.style.content.tab.selectedBorder);
        this.rootNode.style.setProperty("--content-tab-selected-border-top", colorTheme.style.content.tab.selectedBorderTop);
        this.rootNode.style.setProperty("--content-tab-selected-background", colorTheme.style.content.tab.selectedBackground);

        this.rootNode.style.setProperty("--content-settings-dropdown-background", colorTheme.style.content.settings.dropdownBackground);
        this.rootNode.style.setProperty("--content-settings-dropdown-border", colorTheme.style.content.settings.dropdownBorder);
        this.rootNode.style.setProperty("--content-settings-dropdown-foreground", colorTheme.style.content.settings.dropdownForeground);
        this.rootNode.style.setProperty("--content-settings-dropdown-option-hover-background", colorTheme.style.content.settings.dropdownOptionHoverBackground);

        this.rootNode.style.setProperty("--colorPicker-background", colorTheme.style.colorPicker.background);
        this.rootNode.style.setProperty("--colorPicker-border", colorTheme.style.colorPicker.border);
        this.rootNode.style.setProperty("--colorPicker-markerSV", colorTheme.style.colorPicker.markerSV);
        this.rootNode.style.setProperty("--colorPicker-markerHue", colorTheme.style.colorPicker.markerHue);

        this.rootNode.style.setProperty("--contextMenu-background", colorTheme.style.contextMenu.background);
        this.rootNode.style.setProperty("--contextMenu-hoverBackground", colorTheme.style.contextMenu.hoverBackground);

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