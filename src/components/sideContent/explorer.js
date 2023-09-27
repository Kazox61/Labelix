import { eventhandler } from "../../application.js";
import { SideContentBase } from "./sideContentBase.js";

class LabelixImage {
    constructor(name, path, image) {
        this.name = name;
        this.path = path;
        this.canvasImage = image;
    }
}

export class Explorer extends SideContentBase {
    constructor(sideContentNode, settings) {
        super(sideContentNode, settings);
        this.name = "explorer"
        this.explorerSettings = this.settings.sideContent.explorer;

        eventhandler.connect("titlebar.openFolder", async () => {
            const { dirName, dirPath} = await window.electronAPI.openDirectory();
            this.unloadProject();
            await this.openProject(dirName, dirPath);
        });

        eventhandler.connect("componentsBuilt", async () => {
            if (this.settings.lastProjectPath !== null) {
                await this.openProject(this.settings.lastProjectName, this.settings.lastProjectPath);
            }
        });
    }

    async show() {
        await super.show();
        console.log("SHOW");
        this.explorerNode = document.createElement("div");
        this.explorerNode.className = "explorer";
        this.explorerNode.style.setProperty("--explorer-project-header-background", this.explorerSettings.projectHeaderBackground);
        this.explorerNode.style.setProperty("--explorer-element-selected-background", this.explorerSettings.elementSelectedBackground);
        this.explorerNode.style.setProperty("--explorer-element-hover-background", this.explorerSettings.elementHoverBackground);
        this.sideContentNode.appendChild(this.explorerNode);

        this.explorerHeaderNode = document.createElement("div");
        this.explorerHeaderNode.className = "explorer-header";
        this.explorerHeaderNode.innerText = "Explorer";
        this.explorerNode.appendChild(this.explorerHeaderNode);

        if (this.labelData != null) {
            this.showFiles();
        }
    }

    showFiles() {
        this.explorerProjectHeaderNode = document.createElement("div");
        this.explorerProjectHeaderNode.className = "explorer-project-header";
        this.explorerProjectHeaderNode.innerText = this.dirName;
        this.explorerNode.appendChild(this.explorerProjectHeaderNode);

        this.listNode = document.createElement("ul");
        this.listNode.classList.add("explorer-list");
        this.explorerNode.appendChild(this.listNode);

        let i = 0
        this.labelData.forEach(element => {
            let canvasImage = new Image();
            canvasImage.src = element.imagePath;
            let labelixImage = new LabelixImage(element.name, element.imagePath, canvasImage);

            let elementNode = document.createElement("li");
            elementNode.innerText = element.name;
            elementNode.classList.add("explorer-element");

            elementNode.addEventListener("click", () => {
                this.onSelect(elementNode, labelixImage, element.labelBoxes);
            })

            if (i == 0) {
                canvasImage.onload = () => this.onSelect(elementNode, labelixImage, element.labelBoxes);
            }

            this.listNode.appendChild(elementNode);
            i++;
        });
    }

    async openProject(dirName, dirPath) {
        this.settings.lastProjectPath = dirPath;
        this.settings.lastProjectName = dirName;
        eventhandler.emit("settingsUpdated");
        
        this.dirName = dirName;
        this.dirPath = dirPath;

        const labelTypes = await window.electronAPI.loadProject(this.dirPath);
        this.labelData = await window.electronAPI.getDirectoryFiles(this.dirPath);

        eventhandler.emit("projectLoaded", dirPath, labelTypes);

        if (!this.isHidden) {
            this.showFiles();
        }
    }

    onSelect(elementNode, labelixImage, labelBoxes)  {
        if (this.selectedImageNode != null) {
            if (this.selectedImageNode === elementNode) {
                return;
            }
            this.selectedImageNode.classList.remove("selected")
        }

        this.selectedImageNode = elementNode;
        this.selectedImageNode.classList.add("selected");
        eventhandler.emit("explorer:imageSelected", labelixImage, labelBoxes)
        elementNode.classList
    }

    unloadProject() {
        if (this.explorerProjectHeaderNode == null) {
            return;
        }
        this.explorerNode.removeChild(this.explorerProjectHeaderNode);
        this.explorerNode.removeChild(this.listNode);
    }
}