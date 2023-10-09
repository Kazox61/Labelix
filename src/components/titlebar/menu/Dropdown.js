import { eventhandler } from "../../../application.js";

export class Dropdown {
    constructor(content) {
        this.content = content;
    }

    build(menubarNode) {
        this.menubarNode = menubarNode;
        
        this.dropdownNode = document.createElement("div");
        this.dropdownNode.className = "dropdown";
        this.menubarNode.appendChild(this.dropdownNode);

        this.dropdownButton = document.createElement("button");
        this.dropdownButton.className = "dropdown-btn";
        this.dropdownButton.innerText = this.content.name;
        this.dropdownNode.appendChild(this.dropdownButton);

        this.dropdownContentNode = document.createElement("ul");
        this.dropdownContentNode.className = "dropdown-content";
        this.dropdownNode.appendChild(this.dropdownContentNode);

        this.dropdownButton.addEventListener("click", () => {
            this.dropdownContentNode.classList.add("visible");
        });

        document.addEventListener("click", (event) => {
            if (!this.dropdownContentNode.contains(event.target) && event.target !== this.dropdownButton) {
                this.dropdownContentNode.classList.remove("visible");
            }
        });

        this.content.elements.forEach(element => {
            let containerNode = document.createElement("li");
            this.dropdownContentNode.appendChild(containerNode);

            containerNode.addEventListener("click", () => {
                eventhandler.emit(element.clickEventName);
                this.dropdownContentNode.classList.remove("visible");
            });

            let nameNode = document.createElement("p");
            nameNode.className = "dropdown-element-name";
            nameNode.innerText = element.name;
            containerNode.appendChild(nameNode);

            let shortcutNode = document.createElement("p");
            shortcutNode.className = "dropdown-element-shortcut";
            shortcutNode.innerText = element.shortcut.join("+");
            containerNode.appendChild(shortcutNode);
        });
    }
}