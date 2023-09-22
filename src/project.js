import { eventhandler } from "./labelix.js";

class LabelixImage {
    constructor(name, path, image) {
        this.name = name;
        this.path = path;
        this.canvasImage = image;
    }
}

class Project {
    async init(project_root_name, project_root_path, ui) {
        this.project_root_name = project_root_name;
        this.project_root_path = project_root_path;
        this.ui = ui;

        await this.load_images();
        this.add_ui();
    }

    add_ui() {
        let header = document.createElement("div");
        header.innerText = this.project_root_name;
        header.classList.add("explorer-project-root");
        this.ui.secondarySidebar.appendChild(header);

        let list = document.createElement("ul");
        list.classList.add("explorer-list");
        this.ui.secondarySidebar.appendChild(list);

        this.images.forEach(image => {
            let element = document.createElement("li");
            element.innerText = image.name;
            element.classList.add("explorer-element");
            element.addEventListener("click", () => {
                eventhandler.emit("imageSelected", image)
            })
            list.appendChild(element);
        })
    }

    async load_images() {
        this.images = [];
        let images = await window.electronAPI.getDirectoryFiles(this.project_root_path);
    
        for (const [name, path] of Object.entries(images)) {
            let canvasImage = new Image();
            canvasImage.src = path;

            this.images.push(new LabelixImage(name, path, canvasImage))
        }
    }

    close() {
        this.ui.secondarySidebar.replaceChildren();
    }
}

export { Project, LabelixImage }
