import { eventhandler } from "./labelix.js";

export class Dropdown {
    constructor(category) {
        this.category = category

        this.rootElement = document.createElement("div");
        this.rootElement.classList.add("dropdown");

        let dropdownButton = document.createElement("button");
        dropdownButton.classList.add("dropdown-btn");
        dropdownButton.innerText = category.name;
        this.rootElement.appendChild(dropdownButton);
        

        let dropdownContent = document.createElement("ul");
        dropdownContent.classList.add("dropdown-content");
        dropdownContent.classList.add("hidden");
        this.rootElement.appendChild(dropdownContent);

        dropdownButton.addEventListener("click", () => {
            dropdownContent.classList.remove("hidden");
        });

        document.addEventListener("click", (event) => {
            if (!dropdownContent.contains(event.target) && event.target !== dropdownButton) {
                dropdownContent.classList.add("hidden");
            }
        });

        category.elements.forEach((element) => {
            let dropdownElement = document.createElement("li");
            dropdownContent.appendChild(dropdownElement);

            dropdownElement.addEventListener("click", () => {
                eventhandler.emit(element.clickEvent);
                dropdownContent.classList.add("hidden");
            });

            let dropdownElementName = document.createElement("P");
            dropdownElementName.classList.add("dropdown-element-name");
            dropdownElementName.innerText = element.name;
            dropdownElement.appendChild(dropdownElementName);

            let dropdownElementShortcut = document.createElement("P");
            dropdownElementShortcut.classList.add("dropdown-element-shortcut");
            dropdownElementShortcut.innerText = element.shortcut;
            dropdownElement.appendChild(dropdownElementShortcut);
        });
    }
}