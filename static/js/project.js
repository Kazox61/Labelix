class ImageElement {
    constructor(name, path, image) {
        this.name = name;
        this.path = path;
        this.image = image;
    }
}

class Project {
    constructor() {
        this.images = [];
    }

    async load_project() {
        await this.load_images();
        this.create_ui();
    }

    create_ui() {
        let header = document.createElement("div");
        header.innerText = this.project_root_name;
        header.classList.add("explorer-project-root");
        secondary_sidebar.appendChild(header);

        let list = document.createElement("ul");
        list.classList.add("explorer-list");
        secondary_sidebar.appendChild(list);

        this.images.forEach(imageElement => {
            let element = document.createElement("li");
            element.innerText = imageElement.name;
            element.classList.add("explorer-element");
            element.addEventListener("click", () => {
                label_window.activate_image(imageElement);
            })
            list.appendChild(element);
        })
    }

    async choose_project_path() {
        const { dirName, dirPath} = await window.electronAPI.openDirectory();
        this.project_root_name = dirName;
        this.project_root_path = dirPath;
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
}
