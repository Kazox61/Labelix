

export class SidebarBase {
    constructor(app, sidebarNode) {
        this.app = app;
        this.sidebarNode = sidebarNode;
        this.isHidden = true;
    }

    async show() {
        this.isHidden = false;
    }

    hide() {
        this.sidebarNode.replaceChildren();
        this.isHidden = true;
    }
}