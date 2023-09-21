import { Project } from "./project.js"
import { UI } from "./ui.js";
import { EventHandler } from "./eventhandler.js"
import { LabelWindow } from "./labelwindow.js"

class Labelix {
    constructor() {
        this.eventhandler = new EventHandler();
        this.ui = new UI(this.eventhandler);
        this.project = new Project(this.eventhandler);
    }

    start() {
        this.loadConfig();
        this.ui.init(this.project);
        this.label_window = new LabelWindow(this.eventhandler, this.ui);
    }

    loadConfig() {

    }
}


export { Labelix }