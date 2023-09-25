import { SideContentBase } from "./sideContentBase.js";


export class LabelList extends SideContentBase {
    constructor(sideContentNode, settings, sidebarButtonNode) {
        super(sideContentNode, settings, sidebarButtonNode);
        this.nextId = 0;
        this.elements = [];
        this.indexSelectedElement = 0;
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
        tableColorHeaderNode.innerText = "Color";
        tableHeaderRowNode.appendChild(tableColorHeaderNode);
        const tableAmountHeaderNode = document.createElement("th");
        tableAmountHeaderNode.innerText = "Amount";
        tableHeaderRowNode.appendChild(tableAmountHeaderNode);
        
        this.tableBodyNode = document.createElement("tbody");
        this.tableNode.appendChild(this.tableBodyNode);



        
        const newItemNode = document.createElement("div");
        this.containerNode.appendChild(newItemNode);

        const nameRowNode = document.createElement("div");
        newItemNode.appendChild(nameRowNode);

        const nameInputNode = document.createElement("input");
        nameInputNode.setAttribute('type', 'text');
        nameInputNode.className = "newItem-textInput"
        newItemNode.appendChild(nameInputNode);

        const colorRowNode = document.createElement("div");
        newItemNode.appendChild(colorRowNode);

        const colorInputNode = document.createElement("input");
        colorInputNode.setAttribute('type', 'color');
        colorInputNode.className = "newItem-colorInput";
        colorRowNode.appendChild(colorInputNode);

        const addButtonNode = document.createElement("button");
        addButtonNode.innerText = "Add new";
        addButtonNode.className = "labelList-addNewButton";
        this.containerNode.appendChild(addButtonNode);        

        this.addElement("Florian", "#ffffff", 0);
        this.addElement("Florian", "#ffffff", 0);

        for (let index = 0; index < this.elements.length; index++) {
            let element = this.elements[index];
            let selected = index == this.indexSelectedElement;
            this.showElement(element, selected, index);
        }
    }

    showElement(element, selected, index) {
        const bodyElementNode = this.tableBodyNode.insertRow();
        element.rowNode = bodyElementNode;

        if (selected) {
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
        bodyColorNode.innerText = element.color;
        bodyElementNode.appendChild(bodyColorNode);

        const bodyAmountNode = document.createElement("td");
        bodyAmountNode.innerText = element.amount;
        bodyElementNode.appendChild(bodyAmountNode);

        this.nextId++;
    }

    addElement(name, color, amount) {
        this.elements.push({
            "index": this.nextId,
            "name": name,
            "color": color,
            "amount": amount
        })
        this.nextId++;
    }

    selectElement(index) {
        if (this.indexSelectedElement > this.elements.length) return;
        this.elements[this.indexSelectedElement].rowNode.classList.remove("selected");
        this.indexSelectedElement = index;
        this.elements[this.indexSelectedElement].rowNode.classList.add("selected");
    }
}