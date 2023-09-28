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
            "color": this.color,
            "amount": this.amount
        }
    }

    static fromJSON(data) {
        return new LabelClass(data.index, data.name, data.color);
    }
}

export class ClassEditor extends SidebarBase {
    constructor(sidebarNode, settings) {
        super(sidebarNode, settings);
        this.name = "classEditor";
        this.labelClasses = [];

        eventhandler.connect("projectLoaded", (dirPath, labelClassesJSON) => {
            if (this.labelClasses.length > 0) {
                this.labelClasses = [];
                this.tableBodyNode.replaceChildren();
            }

            this.rootPath = dirPath;

            labelClassesJSON.forEach(element => {
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
        this.cassEditorNode = document.createElement("div");
        this.cassEditorNode.className = "classEditor";
        this.sidebarNode.appendChild(this.cassEditorNode);

        this.classEditorHeaderNode = document.createElement("h2");
        this.classEditorHeaderNode.innerText = "Class Editor";
        this.cassEditorNode.appendChild(this.classEditorHeaderNode);

        this.tableNode = document.createElement("table");
        this.cassEditorNode.appendChild(this.tableNode);
        const tableHeaderNode = document.createElement("thead");
        this.tableNode.appendChild(tableHeaderNode);
        const tableHeaderRowNode = document.createElement("tr");
        tableHeaderNode.appendChild(tableHeaderRowNode);
        const tableIndexHeaderNode = document.createElement("th");
        tableIndexHeaderNode.className = "min";
        tableIndexHeaderNode.innerText = "Index";
        tableHeaderRowNode.appendChild(tableIndexHeaderNode);
        const tableNameHeaderNode = document.createElement("th");
        tableNameHeaderNode.innerText = "Name";
        tableHeaderRowNode.appendChild(tableNameHeaderNode);
        const tableColorHeaderNode = document.createElement("th");
        tableColorHeaderNode.className = "min";
        tableColorHeaderNode.innerText = "Color";
        tableHeaderRowNode.appendChild(tableColorHeaderNode);
        const tableAmountHeaderNode = document.createElement("th");
        tableAmountHeaderNode.className = "min";
        tableAmountHeaderNode.innerText = "Amount";
        tableHeaderRowNode.appendChild(tableAmountHeaderNode);
        
        this.tableBodyNode = document.createElement("tbody");
        this.tableNode.appendChild(this.tableBodyNode);


        const inputRowNode = document.createElement("div");
        inputRowNode.className = "inputRow"
        this.cassEditorNode.appendChild(inputRowNode);

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

            const labelClassesJSON = []
            this.labelClasses.forEach(labelClass => {
                labelClassesJSON.push(labelClass.toJSON());
            })
            window.electronAPI.saveProject(this.rootPath, labelClassesJSON);
        });

        for (let index = 0; index < this.labelClasses.length; index++) {
            let labelClass = this.labelClasses[index];
            this.showLabelClass(labelClass);
        }
    }

    showLabelClass(labelClass) {
        const rowNode = this.tableBodyNode.insertRow();

        labelClass.rowNode = rowNode;

        if (this.selectedLabelClass === labelClass) {
            rowNode.className = "selected";
        }

        rowNode.addEventListener("click", () => this.selectLabelClass(labelClass));

        const bodyIndexNode = document.createElement("td");
        bodyIndexNode.className = "min";
        bodyIndexNode.innerText = labelClass.index;
        rowNode.appendChild(bodyIndexNode);

        const bodyNameNode = document.createElement("td");
        bodyNameNode.innerText = labelClass.name;
        rowNode.appendChild(bodyNameNode);

        const bodyColorNode = document.createElement("td");
        bodyColorNode.className = "min";
        bodyColorNode.innerText = labelClass.color;
        rowNode.appendChild(bodyColorNode);

        const bodyAmountNode = document.createElement("td");
        bodyAmountNode.className = "min";
        bodyAmountNode.innerText = labelClass.amount;
        rowNode.appendChild(bodyAmountNode);
    }

    selectLabelClass(labelClass) {
        if (this.selectedLabelClass != null) {
            this.selectedLabelClass.rowNode.classList.remove("selected");
        }
        
        this.selectedLabelClass = labelClass;
        this.selectedLabelClass.rowNode.classList.add("selected");
        eventhandler.emit("classEditor.labelClassSelected", this.selectedLabelClass);
    }
}