import { ContentBase } from "./contentBase.js";
import { eventhandler } from "../../application.js";

class Dropdown {
    constructor(parent, options, selectedIndex=0) {
        this.parent = parent;
        this.options = options;
        this.selectedIndex = selectedIndex;
        this.isOpened = false;
        this.build();
    }

    build() {
        this.dropdownNode = document.createElement("div");
        this.dropdownNode.className = "dropdown";
        this.parent.appendChild(this.dropdownNode);

        this.selectionNode = document.createElement("div");
        this.selectionNode.className = "dropdown-selection";
        this.selectionNode.innerText = this.options[this.selectedIndex];
        this.dropdownNode.appendChild(this.selectionNode);
        this.selectionNode.addEventListener("click", () => {
            if (!this.isOpened) {
                this.isOpened = true;
                this.optionContainerNode.style.display = "block";
            }
            else {
                this.isOpened = false;
                this.optionContainerNode.style.display = "none";
            }
        });

        this.optionContainerNode = document.createElement("ul");
        this.optionContainerNode.className = "dropdown-option-container";
        this.dropdownNode.appendChild(this.optionContainerNode);
        
        this.options.forEach((option, index) => {
            const optionNode = document.createElement("li");
            optionNode.className = "dropdown-option";
            optionNode.innerText = option;
            this.optionContainerNode.appendChild(optionNode);
            optionNode.addEventListener("click", () => {
                this.selectionNode.innerText = option;
                this.callback(option);
            })
        });

        window.addEventListener("click", (event) => {
            if (this.isOpened && event.target != this.selectionNode) {
                this.isOpened = false;
                this.optionContainerNode.style.display = "none";
            }
        })
    }
}


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

        const themeOptions = [];
        this.app.themes.forEach(theme => {
            themeOptions.push(theme.name);
        });
        const themeDropdown = new Dropdown(fieldThemeNode, themeOptions);
        themeDropdown.callback = (option) => {
            for (const theme of this.app.themes) {
                if (theme.name === option) {
                    this.app.updateColorTheme(theme);
                    return;
                }
            }
        }
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

        this.createKeyboardTableRow(tableBodyNode, "Open Folder/Project", "ctrl+o");
        this.createKeyboardTableRow(tableBodyNode, "previous Image", "a || ←");
        this.createKeyboardTableRow(tableBodyNode, "next Image", "d || →");
        this.createKeyboardTableRow(tableBodyNode, "previous Label Class", "w || ↑");
        this.createKeyboardTableRow(tableBodyNode, "next Label Class", "s || ↓");

    }

    createKeyboardTableRow(tableBodyNode, command, keybinding) {
        const rowNode = tableBodyNode.insertRow();

        const tdCommand = document.createElement("td");
        tdCommand.innerText = command
        rowNode.appendChild(tdCommand);

        const tdKeybinding = document.createElement("td");
        tdKeybinding.innerText = keybinding
        rowNode.appendChild(tdKeybinding);
    }

    moveToSection(section) {
        const boundsScroll = this.scrollContainerNode.getBoundingClientRect();
        const boundsSection = section.getBoundingClientRect();

        this.scrollContainerNode.scrollTo(0, boundsSection.top - boundsScroll.top);
    }
}