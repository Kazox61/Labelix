import { eventhandler } from "../../application.js";
import { SideContentBase } from "./sideContentBase.js";


export class LabelList extends SideContentBase {
    constructor(sideContentNode, settings, sidebarButtonNode) {
        super(sideContentNode, settings, sidebarButtonNode);
        this.nextId = 0;
        this.nodes = [];

        eventhandler.connect("projectLoaded", (dirPath, labelTypes) => {
            this.indexSelectedElement = 0; 
            this.rootPath = dirPath;
            this.labelTypes = labelTypes
            this.nextId = labelTypes.length;
        })
    }

    async show() {
        await super.show()

        this.containerNode = document.createElement("div");
        this.containerNode.className = "labelList";
        this.sideContentNode.appendChild(this.containerNode);

        this.tableNode = document.createElement("table");
        this.tableNode.className = "labelList-table"
        this.containerNode.appendChild(this.tableNode);
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



        
        const newItemNode = document.createElement("div");
        newItemNode.className = "newItem"
        this.containerNode.appendChild(newItemNode);

        const nameRowNode = document.createElement("div");
        newItemNode.appendChild(nameRowNode);

        const nameInputNode = document.createElement("input");
        nameInputNode.setAttribute('type', 'text');
        nameInputNode.setAttribute('placeholder', 'car');
        nameInputNode.className = "newItem-textInput"
        newItemNode.appendChild(nameInputNode);

        const colorInputNode = document.createElement("input");
        colorInputNode.setAttribute('type', 'text');
        colorInputNode.setAttribute('placeholder', '#ff0000');
        colorInputNode.className = "newItem-textInput"
        newItemNode.appendChild(colorInputNode);

        const commitInputNode = document.createElement("button");
        commitInputNode.innerText = "add";
        commitInputNode.className = "addButton";
        newItemNode.appendChild(commitInputNode);
        commitInputNode.addEventListener("click", () => {

            let element = {
                "index": this.nextId,
                "name": nameInputNode.value,
                "color": colorInputNode.value,
                "amount": 0
            }
            nameInputNode.value = "";
            colorInputNode.value = "";

            this.labelTypes.push(element);
            this.showElement(element, this.nextId);
            this.nextId++;

            window.electronAPI.saveProject(this.rootPath, this.labelTypes);
        });

        for (let index = 0; index < this.labelTypes.length; index++) {
            let element = this.labelTypes[index];
            this.showElement(element, index);
        }
    }

    showElement(element, index) {
        const bodyElementNode = this.tableBodyNode.insertRow();

        this.nodes.push(bodyElementNode);

        if (index === this.indexSelectedElement) {
            bodyElementNode.className = "selected";
        }

        bodyElementNode.addEventListener("click", () => this.selectElement(index));

        const bodyIndexNode = document.createElement("td");
        bodyIndexNode.className = "min";
        bodyIndexNode.innerText = element.index;
        bodyElementNode.appendChild(bodyIndexNode);

        const bodyNameNode = document.createElement("td");
        bodyNameNode.innerText = element.name;
        bodyElementNode.appendChild(bodyNameNode);

        const bodyColorNode = document.createElement("td");
        bodyColorNode.className = "min";
        bodyColorNode.innerText = element.color;
        bodyElementNode.appendChild(bodyColorNode);

        const bodyAmountNode = document.createElement("td");
        bodyAmountNode.className = "min";
        bodyAmountNode.innerText = element.amount;
        bodyElementNode.appendChild(bodyAmountNode);
    }

    selectElement(index) {
        if (this.indexSelectedElement > this.labelTypes.length) return;
        console.log(this.nodes, this.indexSelectedElement);
        this.nodes[this.indexSelectedElement].classList.remove("selected");
        this.indexSelectedElement = index;
        this.nodes[this.indexSelectedElement].classList.add("selected");
        eventhandler.emit("labelList:selectLabel", index, this.labelTypes[this.indexSelectedElement].color);
    }
}