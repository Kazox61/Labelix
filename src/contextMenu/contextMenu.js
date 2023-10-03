

export class ContextMenu {
    constructor() {
        this.contextMenus = [];

        document.addEventListener("contextmenu", (event) => {
            if (this.contextMenus.length === 0) {
                return
            }
            else if (this.contextMenus.length === 1) {
                const contextMenu = this.contextMenus[0];
                if (event.target === contextMenu.triggerNode || contextMenu.triggerNode.contains(event.target)) {
                    return;
                }
            }

            const last = this.contextMenus.shift();
            last.triggerNode.classList.remove("contextMenu-triggerHighlighted");
            last.parentNode.removeChild(last.node);
            
        });

        document.addEventListener("click", (event) => {
            if (this.contextMenus.length === 0) {
                return
            }
            else if (this.contextMenus.length === 1) {
                const contextMenu = this.contextMenus[0];
                if (event.target !== contextMenu.node && !contextMenu.node.contains(event.target)) {
                    this.closeMenu();
                }
            }
        });
    }

    createMenu(triggerNode, parentNode, posX, posY, menuItems) {
        const contextMenuNode = document.createElement("div");
        contextMenuNode.className = "contextMenu";
        contextMenuNode.style.setProperty("--contextMenuPositionX", posX+"px");
        contextMenuNode.style.setProperty("--contextMenuPositionY", posY+"px");
        parentNode.appendChild(contextMenuNode);
        this.contextMenus.push({
            triggerNode: triggerNode,
            parentNode: parentNode,
            node: contextMenuNode
        });

        triggerNode.classList.add("contextMenu-triggerHighlighted");

        const contextMenuListNode = document.createElement("ul");
        contextMenuNode.appendChild(contextMenuListNode);

        Object.entries(menuItems).forEach(entry => {
            const [name, action] = entry;
            const itemNode = document.createElement("li");
            itemNode.innerText = name;
            contextMenuListNode.appendChild(itemNode);
            itemNode.addEventListener("click", () => {
                action();
                this.closeMenu();
            });
        });
    }

    closeMenu() {
        this.contextMenus.forEach(menu => {
            menu.triggerNode.classList.remove("contextMenu-triggerHighlighted")
            menu.parentNode.removeChild(menu.node);
        })
        this.contextMenus = [];
    }
}