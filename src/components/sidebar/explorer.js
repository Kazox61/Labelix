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
            const elementNode = document.createElement("li");
            labelImage.elementNode = elementNode;
            this.listNode.appendChild(elementNode);

            const imageNameContainerNode = document.createElement("div");
            imageNameContainerNode.className = "explorer-imageNameContainer";
            elementNode.appendChild(imageNameContainerNode);

            imageNameContainerNode.innerHTML = '<svg class="explorer-openIndicator" viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>arrow_down [#338]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -6684.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583" id="arrow_down-[#338]"> </path> </g> </g> </g> </g></svg>'
            imageNameContainerNode.addEventListener("click", () => {
                this.selectLabelixImage(labelImage);
                this.toggleClasses(labelImage);
            })

            const textNode = document.createElement("span");
            textNode.innerText = labelImage.name;
            imageNameContainerNode.appendChild(textNode);
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
        eventhandler.emit("explorer.imageSelected", labelixImage);
    }

    toggleClasses(labelixImage) {
        const indicatorNode = labelixImage.elementNode.querySelector(".explorer-openIndicator")
        indicatorNode.classList.toggle("opened");

        if (indicatorNode.classList.contains("opened")) {
            const ulNode = document.createElement("ul");
            labelixImage.elementNode.appendChild(ulNode);
            labelixImage.classContainer = ulNode;

            this.app.sidebar.classEditor.labelClasses.forEach(labelClass => {
                const liNode = document.createElement("li");
                liNode.className = "explorer-classElement";
                ulNode.appendChild(liNode);

                const classColorNode = document.createElement("div");
                classColorNode.className = "explorer-classElement-color";
                classColorNode.style.backgroundColor = labelClass.color;
                liNode.appendChild(classColorNode);

                let amount = 0;
                labelixImage.labelBoxes.forEach(labelBox => {
                    if (labelBox[0] === labelClass.index) {
                        amount++;
                    }
                });

                const labelClassNameNode = document.createElement("span");
                labelClassNameNode.innerText = labelClass.name + ": " + amount;
                liNode.appendChild(labelClassNameNode);

                liNode.addEventListener("contextmenu", (event) => {
                    this.app.contextMenu.createMenu(liNode, ulNode, event.clientX, event.clientY, {
                        "Delete Labels for class": () => console.log("Delete all Labels")
                    })
                });

                eventhandler.connect("labelBoxesModified", (selectedLabelixImage, indexLabelClass) => {
                    if (selectedLabelixImage === labelixImage && indexLabelClass === labelClass.index) {
                        let amount = 0;
                        labelixImage.labelBoxes.forEach(labelBox => {
                            if (labelBox[0] === labelClass.index) {
                                amount++;
                            }
                        });
                        labelClassNameNode.innerText = labelClass.name + ": " + amount;
                    }
                });
            })
        }
        else {
            labelixImage.elementNode.removeChild(labelixImage.classContainer);
        }
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