import { eventhandler } from "../../application.js";

class LabelixImage {
    constructor(name, path, image) {
        this.name = name;
        this.path = path;
        this.canvasImage = image;
    }
}

export class Explorer {
    constructor(sideContentNode, explorerSettings) {
        this.sideContentNode = sideContentNode;
        this.explorerSettings = explorerSettings;

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

        eventhandler.connect("tb:openFolder", async () => {
            const { dirName, dirPath} = await window.electronAPI.openDirectory();
            
            await this.loadDirectory(dirName, dirPath);
        });
    }

    async loadDirectory(dirName, dirPath) {
        this.dirName = dirName;
        this.dirPath = dirPath;

        this.explorerProjectHeaderNode = document.createElement("div");
        this.explorerProjectHeaderNode.className = "explorer-project-header";
        this.explorerProjectHeaderNode.innerText = this.dirName;
        this.explorerNode.appendChild(this.explorerProjectHeaderNode);

        this.images = [];
        let images = await window.electronAPI.getDirectoryFiles(this.dirPath);

        let listNode = document.createElement("ul");
        listNode.classList.add("explorer-list");
        this.explorerNode.appendChild(listNode);
    
        for (const [name, path] of Object.entries(images)) {
            let canvasImage = new Image();
            canvasImage.src = path;

            let labelixImage = new LabelixImage(name, path, canvasImage);

            
            let elementNode = document.createElement("li");
            elementNode.innerText = name;
            elementNode.classList.add("explorer-element");
            elementNode.addEventListener("click", () => {
                if (this.selectedImageNode != null) {
                    if (this.selectedImageNode === elementNode) {
                        return;
                    }

                    this.selectedImageNode.classList.remove("selected")
                }

                this.selectedImageNode = elementNode;
                this.selectedImageNode.classList.add("selected");
                eventhandler.emit("explorer:imageSelected", labelixImage)
                elementNode.classList
            })
            listNode.appendChild(elementNode);
        }
    }
}