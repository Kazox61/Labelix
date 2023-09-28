

export class SidebarBase {
    constructor(sidebarNode, settings) {
        this.sidebarNode = sidebarNode;
        this.settings = settings;
        this.isHidden = true;
    }

    async show() {
        this.sidebarNode.replaceChildren();
        this.isHidden = false;     
    }

    hide() {
        this.isHidden = true;
    }
}