import { ContentBase } from "./contentBase.js";


export class SettingsEditor extends ContentBase {
    constructor(app, contentContainerNode, contentbarNode) {
        super(app, contentContainerNode, contentbarNode);
        this.name = "Settings";
        this.sections = [];
    }

    show() {
        super.show();

        this.settingsEditorNode = document.createElement("div");
        this.settingsEditorNode.className = "settingsEditor";
        this.contentContainerNode.appendChild(this.settingsEditorNode);

        this.navbarNode = document.createElement("div");
        this.navbarNode.className = "navbar";
        this.settingsEditorNode.appendChild(this.navbarNode);

        this.scrollContainerNode = document.createElement("div");
        this.scrollContainerNode.className = "scrollContainer";
        this.settingsEditorNode.appendChild(this.scrollContainerNode);

        this.createSections();
    }

    createSections() {
        this.createAppearanceSection();
        this.createKeyboardSection();
    }

    createAppearanceSection() {
        const referenceNode = document.createElement("div");
        referenceNode.innerText = "Appearance";
        referenceNode.className = "reference";
        this.navbarNode.appendChild(referenceNode);

        const sectionNode = document.createElement("div");
        sectionNode.className = "section";
        this.scrollContainerNode.appendChild(sectionNode);
        this.sections.push({
            reference: referenceNode,
            section: sectionNode
        })

        referenceNode.addEventListener("click", () => {
            this.moveToSection(sectionNode);
        });

        const sectionHeaderNode = document.createElement("div");
        sectionHeaderNode.className = "sectionHeader"
        sectionHeaderNode.innerText = "Appearance";
        sectionNode.appendChild(sectionHeaderNode);

        const fieldThemeNode = document.createElement("div");
        fieldThemeNode.className = "field";
        sectionNode.appendChild(fieldThemeNode);

        const themeHeaderNode = document.createElement("div");
        themeHeaderNode.innerText = "Theme"
        themeHeaderNode.className = "field-header";
        fieldThemeNode.appendChild(themeHeaderNode);

        const themeDescriptionNode = document.createElement("div");
        themeDescriptionNode.innerText = "You can select a theme to make the look of the UI different."
        themeDescriptionNode.className = "field-description";
        fieldThemeNode.appendChild(themeDescriptionNode);
    }

    createKeyboardSection() {
        const referenceNode = document.createElement("div");
        referenceNode.innerText = "Keyboard";
        this.navbarNode.appendChild(referenceNode);

        const sectionNode = document.createElement("div");
        sectionNode.className = "section";
        this.scrollContainerNode.appendChild(sectionNode);
        this.sections.push({
            reference: referenceNode,
            section: sectionNode
        })

        referenceNode.addEventListener("click", () => {
            this.moveToSection(sectionNode);
        });

        const sectionHeaderNode = document.createElement("div");
        sectionHeaderNode.className = "sectionHeader"
        sectionHeaderNode.innerText = "Keyboard Shortcuts";
        sectionNode.appendChild(sectionHeaderNode);

        const tableNode = document.createElement("table");
        sectionNode.appendChild(tableNode);

        const theadNode = document.createElement("thead");
        tableNode.appendChild(theadNode);
        
        const theadRowNode = document.createElement("tr");
        theadNode.appendChild(theadRowNode);

        const thCommandNode = document.createElement("th");
        thCommandNode.innerText = "Command";
        theadRowNode.appendChild(thCommandNode);

        const thKeybindingNode = document.createElement("th");
        thKeybindingNode.innerText = "Keybinding";
        theadRowNode.appendChild(thKeybindingNode);

        const tableBodyNode = document.createElement("tbody");
        tableNode.appendChild(tableBodyNode);

        const rowOpenFolderNode = tableBodyNode.insertRow();

        const tdCommandOpenFolder = document.createElement("td");
        tdCommandOpenFolder.innerText = "Open Folder/Project";
        rowOpenFolderNode.appendChild(tdCommandOpenFolder);

        const tdKeybindingOpenFolder = document.createElement("td");
        tdKeybindingOpenFolder.innerText = "ctrl+o"
        rowOpenFolderNode.appendChild(tdKeybindingOpenFolder);

    }

    moveToSection(section) {
        const boundsScroll = this.scrollContainerNode.getBoundingClientRect();
        const boundsSection = section.getBoundingClientRect();

        this.scrollContainerNode.scrollTo(0, boundsSection.top - boundsScroll.top);
    }
}