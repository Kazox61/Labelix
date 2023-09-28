import { eventhandler } from "../../application.js";
import { SidebarBase } from "./sidebarBase.js";

class LabelixImage {
    constructor(name, path, image, labelBoxes) {
        this.name = name;
        this.path = path;
        this.canvasImage = image;
        this.labelBoxes = labelBoxes;
    }
}

export class Explorer extends SidebarBase {
    constructor(sidebarNode, settings) {
        super(sidebarNode, settings);
        this.name = "explorer";
        this.explorerSettings = this.settings.sidebar.explorer;
        this.labelixImages = []
        this.isProjectLoaded = false;

        eventhandler.connect("titlebar.openFolder", async () => {
            const result = await window.electronAPI.openDirectory();

            if (result == null) {
                return;
            }

            this.unloadProject();
            await this.openProject(result.dirName, result.dirPath);

            if (!this.isHidden) {
                this.showProject();
            }
        });

        eventhandler.connect("componentsBuilt", async () => {
            if (this.settings.lastProjectPath !== null) {
                await this.openProject(this.settings.lastProjectName, this.settings.lastProjectPath);
                
                if (this.labelixImages.length > 0) {
                    this.selectedLabelixImage = this.labelixImages[0];
                    this.selectLabelixImage(this.selectedLabelixImage);
                }

                if (!this.isHidden) {
                    this.showProject();
                }
            }
        });
    }

    async show() {
        await super.show();
        this.explorerNode = document.createElement("div");
        this.explorerNode.className = "explorer";
        this.explorerNode.style.setProperty("--explorer-project-header-background", this.explorerSettings.projectHeaderBackground);
        this.explorerNode.style.setProperty("--explorer-element-selected-background", this.explorerSettings.elementSelectedBackground);
        this.explorerNode.style.setProperty("--explorer-element-hover-background", this.explorerSettings.elementHoverBackground);
        this.sidebarNode.appendChild(this.explorerNode);

        this.explorerHeaderNode = document.createElement("h2");
        this.explorerHeaderNode.innerText = "Explorer";
        this.explorerNode.appendChild(this.explorerHeaderNode);

        if (this.isProjectLoaded) this.showProject();
    }

    showProject() {
        this.explorerProjectHeaderNode = document.createElement("div");
        this.explorerProjectHeaderNode.className = "project-header";
        this.explorerProjectHeaderNode.innerText = this.dirName;
        this.explorerNode.appendChild(this.explorerProjectHeaderNode);

        this.listNode = document.createElement("ul");
        this.explorerNode.appendChild(this.listNode);

        this.labelixImages.forEach(labelImage => {
            let elementNode = document.createElement("li");
            elementNode.innerText = labelImage.name;
            labelImage.elementNode = elementNode;

            elementNode.addEventListener("click", () => {
                this.selectLabelixImage(labelImage);
            })

            this.listNode.appendChild(elementNode);
        });

        this.selectedLabelixImage.elementNode.classList.add("selected");
    }

    async openProject(dirName, dirPath) {
        this.settings.lastProjectPath = dirPath;
        this.settings.lastProjectName = dirName;
        eventhandler.emit("settingsUpdated");
        
        this.dirName = dirName;
        this.dirPath = dirPath;

        this.projectData = await window.electronAPI.loadProject(dirPath);

        let i = 0
        this.projectData.images.forEach(image => {
            let canvasImage = new Image();
            canvasImage.src = image.imagePath;
            if (this.labelixImages.length > 0) {
                this.selectedLabelixImage = this.labelixImages[0];
                canvasImage.onload = () => {
                    eventhandler.emit("explorer.imageSelected", this.labelixImages[0]);
                }
            }
            let labelixImage = new LabelixImage(image.name, image.imagePath, canvasImage, image.labelBoxes);
            this.labelixImages.push(labelixImage);
            i++;
        })

        this.isProjectLoaded = true;
        eventhandler.emit("projectLoaded", dirPath, this.projectData.labelClasses);
    }

    selectLabelixImage(labelixImage)  {
        if (this.selectedLabelixImage != null) {
            if (this.selectedLabelixImage === labelixImage) {
                return;
            }
            this.selectedLabelixImage.elementNode.classList.remove("selected")
        }

        this.selectedLabelixImage = labelixImage;
        this.selectedLabelixImage.elementNode.classList.add("selected");
        eventhandler.emit("explorer.imageSelected", labelixImage);
    }

    unloadProject() {
        if (!this.isProjectLoaded) {
            return;
        }
        this.labelixImages = [];

        if (!this.isHidden) {
            this.explorerNode.removeChild(this.explorerProjectHeaderNode);
            this.explorerNode.removeChild(this.listNode);
        }
    }
}