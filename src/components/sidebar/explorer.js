import { eventhandler } from "../../application.js";
import { SidebarBase } from "./sidebarBase.js";

export class Explorer extends SidebarBase {
    constructor(app, sidebarNode) {
        super(app, sidebarNode);
        this.name = "explorer";
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
            if (this.app.config.hasOwnProperty("lastProjectPath")) {
                await this.openProject(this.app.config.lastProjectName, this.app.config.lastProjectPath);
                
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

        this.project.images.forEach(labelImage => {
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
        this.app.config.lastProjectPath = dirPath;
        this.app.config.lastProjectName = dirName;
        eventhandler.emit("configUpdated");
        
        this.dirName = dirName;
        this.dirPath = dirPath;

        this.project = await window.electronAPI.loadProject(dirPath);

        this.project.images.forEach((image, index) => {
            image.canvasImage = new Image();
            if (index === 0) {
                this.selectedLabelixImage = this.project.images[0];
                image.canvasImage.onload = () => {
                    eventhandler.emit("explorer.imageSelected", this.selectedLabelixImage);
                }
            }
            image.canvasImage.src = image.imagePath;
        });

        this.isProjectLoaded = true;
        eventhandler.emit("projectLoaded", dirPath, this.project);
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
        console.log(this.labelixImages);
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