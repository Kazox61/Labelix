

export class SidebarBase {
    constructor(app, sidebarNode) {
        this.app = app;
        this.sidebarNode = sidebarNode;
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