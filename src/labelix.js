import { Project } from "./project.js"
import { UI } from "./ui.js";
import { EventHandler } from "./eventhandler.js"
import { LabelWindow } from "./labelwindow.js"

const eventhandler = new EventHandler();

class Labelix {
    constructor() {
        this.ui = new UI();
        this.openedProject = null
    }

    async start() {
        await this.loadSettings();
        this.ui.init(this.settings);
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

        eventhandler.connect("window:close", () => {
            if (this.openedProject !== null) {
                this.openedProject.close();


            }
        });
    }

    async loadSettings() {
        this.settings = await window.electronAPI.getSettings();
    }
}


export { Labelix, eventhandler }