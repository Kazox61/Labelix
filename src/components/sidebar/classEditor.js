import { SidebarBase } from "./sidebarBase.js";
import { eventhandler } from "../../application.js"

class LabelClass {
    constructor(index, name, color) {
        this.index = index;
        this.name = name;
        this.color = color;
        this.amount = 0;
        this.rowNode = null;
    }

    toJSON() {
        return {
            "index": this.index,
            "name": this.name,
            "color": this.color
        }
    }

    static fromJSON(data) {
        return new LabelClass(data.index, data.name, data.color);
    }
}

export class ClassEditor extends SidebarBase {
    constructor(app, sidebarNode) {
        super(app, sidebarNode);
        this.name = "classEditor";
        this.labelClasses = [];

        eventhandler.connect("projectLoaded", (dirPath, project) => {
            if (this.labelClasses.length > 0) {
                this.labelClasses = [];
                if (!this.isHidden) {
                    this.tableBodyNode.replaceChildren();
                }
            }

            this.rootPath = dirPath;

            project.labelClasses.forEach(element => {
                this.labelClasses.push(LabelClass.fromJSON(element));
            });

            if (this.labelClasses.length > 0) {
                this.selectedLabelClass = this.labelClasses[0];
                eventhandler.emit("classEditor.labelClassSelected", this.selectedLabelClass);
            }

            if (!this.isHidden) {
                this.labelClasses.forEach(labelClass => this.showLabelClass(labelClass));
            }
        });
    }

    async show() {
        await super.show();
        this.classEditorNode = document.createElement("div");
        this.classEditorNode.className = "classEditor";
        this.sidebarNode.appendChild(this.classEditorNode);

        this.classEditorHeaderNode = document.createElement("h2");
        this.classEditorHeaderNode.innerText = "Class Editor";
        this.classEditorNode.appendChild(this.classEditorHeaderNode);

        this.classEditorContainerNode = document.createElement("div");
        this.classEditorContainerNode.className = "classEditorContainer";
        this.classEditorNode.appendChild(this.classEditorContainerNode)

        this.tableNode = document.createElement("table");
        this.classEditorContainerNode.appendChild(this.tableNode);
        const tableHeaderNode = document.createElement("thead");
        this.tableNode.appendChild(tableHeaderNode);
        const tableHeaderRowNode = document.createElement("tr");
        tableHeaderNode.appendChild(tableHeaderRowNode);
        const tableNameHeaderNode = document.createElement("th");
        tableNameHeaderNode.innerText = "Name";
        tableHeaderRowNode.appendChild(tableNameHeaderNode);
        const tableColorHeaderNode = document.createElement("th");
        tableColorHeaderNode.className = "min";
        tableColorHeaderNode.innerText = "Color";
        tableHeaderRowNode.appendChild(tableColorHeaderNode);
        
        this.tableBodyNode = document.createElement("tbody");
        this.tableNode.appendChild(this.tableBodyNode);


        const inputRowNode = document.createElement("div");
        inputRowNode.className = "inputRow"
        this.classEditorContainerNode.appendChild(inputRowNode);

        const nameRowNode = document.createElement("div");
        inputRowNode.appendChild(nameRowNode);

        const nameInputNode = document.createElement("input");
        nameInputNode.setAttribute('type', 'text');
        nameInputNode.setAttribute('placeholder', 'car');
        nameInputNode.className = "inputRow-textInput"
        inputRowNode.appendChild(nameInputNode);

        const colorInputNode = document.createElement("input");
        colorInputNode.setAttribute('type', 'text');
        colorInputNode.setAttribute('placeholder', '#ff0000');
        colorInputNode.className = "inputRow-textInput"
        inputRowNode.appendChild(colorInputNode);

        const commitInputNode = document.createElement("button");
        commitInputNode.innerText = "add";
        commitInputNode.className = "addButton";
        inputRowNode.appendChild(commitInputNode);
        commitInputNode.addEventListener("click", () => {

            this.insertlabelClassRow(nameInputNode, colorInputNode, inputRowNode);
        });

        for (let index = 0; index < this.labelClasses.length; index++) {
            let labelClass = this.labelClasses[index];
            this.showLabelClass(labelClass);
        }
    }

    insertlabelClassRow(nameInputNode, colorInputNode, inputRowNode) {
        let labelClass = new LabelClass(
            this.labelClasses.length,
            nameInputNode.value,
            colorInputNode.value
        );
        labelClass.rowNode = inputRowNode;
        nameInputNode.value = "";
        colorInputNode.value = "";

        this.labelClasses.push(labelClass);

        if (this.selectedLabelClass == null) {
            this.selectedLabelClass = labelClass;
        }

        this.showLabelClass(labelClass);
        this.saveProject();
    }

    saveProject() {
        const labelClassesJSON = [];
        this.labelClasses.forEach(labelClass => {
            labelClassesJSON.push(labelClass.toJSON());
        });
        window.electronAPI.saveProject(this.rootPath, labelClassesJSON);
    }

    showLabelClass(labelClass) {
        const rowNode = this.tableBodyNode.insertRow();
        rowNode.className = "labelClassRow";
        labelClass.rowNode = rowNode;

        rowNode.addEventListener("click", () => this.selectLabelClass(labelClass));
        rowNode.addEventListener("contextmenu", (event) => {
            event.preventDefault();

            this.app.contextMenu.createMenu(rowNode, this.classEditorNode, event.clientX, event.clientY, {
                "Delete": () => this.deleteLabelClass(labelClass)
    
            });

        });

        const bodyNameNode = document.createElement("td");
        bodyNameNode.innerText = labelClass.name;
        rowNode.appendChild(bodyNameNode);

        labelClass.nameNode = bodyNameNode;
        if (this.selectedLabelClass === labelClass) {
            bodyNameNode.className = "selected";
        }

        const bodyColorNode = document.createElement("td");
        bodyColorNode.className = "min";
        bodyColorNode.style.backgroundColor = labelClass.color;
        rowNode.appendChild(bodyColorNode);
    }

    deleteLabelClass(labelClass) {
        const deletedLabelClassIndex = this.labelClasses.indexOf(labelClass);
        this.tableBodyNode.removeChild(labelClass.rowNode);
        this.labelClasses.splice(deletedLabelClassIndex, 1);

        this.updateIndexLabelClasses(deletedLabelClassIndex);
        this.saveProject();
        
        if (labelClass === this.selectedLabelClass && this.labelClasses.length > 0) {
            this.selectLabelClass(this.labelClasses[0]);
        }
    }

    updateIndexLabelClasses(deletedLabelClassIndex) {
        this.labelClasses.forEach((labelClass, newIndex) => {
            this.updateIndexLabelBoxes(labelClass, newIndex, deletedLabelClassIndex);
        });
        this.labelClasses.forEach((labelClass, newIndex) => {
            labelClass.index = newIndex;
        });
        
        this.app.sidebar.explorer.project.images.forEach(labelixImage => {
            eventhandler.emit("labelBoxesModified", labelixImage);
        });
    }

    updateIndexLabelBoxes(labelClass, newIndex, deletedLabelClassIndex) {
        this.app.sidebar.explorer.project.images.forEach(labelixImage => {
            labelixImage.labelBoxes = labelixImage.labelBoxes.filter(labelbox => labelbox[0] !== deletedLabelClassIndex);
            labelixImage.labelBoxes.forEach(labelBox => {
                if (labelBox[0] === labelClass.index) {
                    labelBox[0] = newIndex;
                }
            });
        });
    }

    selectLabelClass(labelClass) {
        if (this.selectedLabelClass != null) {
            this.selectedLabelClass.nameNode.classList.remove("selected");
        }
        
        this.selectedLabelClass = labelClass;
        this.selectedLabelClass.nameNode.classList.add("selected");
        eventhandler.emit("classEditor.labelClassSelected", this.selectedLabelClass);
    }
}