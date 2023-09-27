

export class SideContentBase {
    constructor(sideContentNode, settings) {
        this.sideContentNode = sideContentNode;
        this.settings = settings;
        this.isHidden = true;
    }

    async show() {
        this.sideContentNode.replaceChildren();
        this.isHidden = false;     
    }

    hide() {
        this.isHidden = true;
    }
}