

export class SideContentBase {
    constructor(sideContentNode, settings, sidebarButtonNode) {
        this.sideContentNode = sideContentNode;
        this.settings = settings;
        this.sidebarButtonNode = sidebarButtonNode;
        this.isHidden = true;
    }

    async show() {
        this.isHidden = false;        
    }

    hide() {
        this.isHidden = true;
        this.sideContentNode.replaceChildren();
    }
}