import { Project } from "./project.js"
import { UI } from "./ui.js";
import { EventHandler } from "./eventhandler.js"
import { LabelWindow } from "./labelwindow.js"

const eventhandler = new EventHandler();

class Labelix {
    constructor() {
        this.ui = new UI();
        this.project = new Project();
        this.openedProject = null
    }

    start() {
        this.loadConfig();
        this.ui.init();
        this.label_window = new LabelWindow(this.ui);
        this.connectEvents();
    }

    connectEvents() {
        eventhandler.connect("titlebar:openFolder", async () => {
            const { dirName, dirPath} = await window.electronAPI.openDirectory();
            if (this.openedProject !== null) {
                this.openedProject.close();
            }
            this.openedProject = new Project();
            this.openedProject.init(dirName, dirPath, this.ui);
        });
    }

    loadConfig() {

    }
}


export { Labelix, eventhandler }