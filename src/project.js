import { eventhandler } from "./labelix.js";

class ImageElement {
    constructor(name, path, image) {
        this.name = name;
        this.path = path;
        this.image = image;
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
        this.ui.secondary_sidebar.appendChild(header);

        let list = document.createElement("ul");
        list.classList.add("explorer-list");
        this.ui.secondary_sidebar.appendChild(list);

        this.images.forEach(imageElement => {
            let element = document.createElement("li");
            element.innerText = imageElement.name;
            element.classList.add("explorer-element");
            element.addEventListener("click", () => {
                eventhandler.emit("image_activated", imageElement)
            })
            list.appendChild(element);
        })
    }

    async load_images() {
        this.images = [];
        let images = await window.electronAPI.getDirectoryFiles(this.project_root_path);
    
        for (const [name, path] of Object.entries(images)) {
            let image = new Image();
            image.src = path;

            this.images.push(new ImageElement(name, path, image))
        }
    }

    close() {
        this.ui.secondary_sidebar.replaceChildren();
    }
}

export { Project, ImageElement }
