import { ProductDataManager } from "../DataHolders/ProductDataHolder.js";

let data = new ProductDataManager();

function mainElements(elements) {
    let mainDiv = document.getElementById("mainPage");
    let buttonContainer = document.createElement("div");
    let elementsContainer = document.createElement("div");

    buttonContainer.id = "buttonContainer";
    elementsContainer.id = "elementsContainer";

    // Melhorei o espaçamento e alinhamento dos botões
    buttonContainer.classList.add("d-flex", "gap-3", "justify-content-center", "mt-4", "mb-3");
    elementsContainer.classList.add("justify-content-center", "mb-4");

    mainDiv.replaceChildren();
   
    // Estilização consistente para todos os botões
    const createStyledButton = (text, id) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.id = id;
        button.classList.add("btn", "btn-sm", "shadow");
        button.style.backgroundColor = "#ff69b4";
        button.style.color = "white";
        button.style.borderRadius = "20px";
        button.style.padding = "8px 20px";
        button.style.fontSize = "14px";
        button.style.fontWeight = "bold";
        button.style.border = "none";
        button.style.transition = "transform 0.2s, box-shadow 0.2s";
        
        // Adiciona efeito hover via JavaScript
        button.onmouseover = function() {
            this.style.transform = "translateY(-2px)";
            this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            this.style.backgroundColor = "#ff5ba7";
        };
        
        button.onmouseout = function() {
            this.style.transform = "translateY(0)";
            this.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            this.style.backgroundColor = "#ff69b4";
        };
        
        return button;
    };

    let addButton = createStyledButton("Adicionar", "mainButton");
    let editButton = createStyledButton("Editar", "editButton");
    let deleteButton = createStyledButton("Apagar", "deleteButton");
    
    elementsContainer.append(elements);
    buttonContainer.append(addButton, editButton, deleteButton);
    mainDiv.append(elementsContainer, buttonContainer);
}

function genareteTable(header) {
    // Criar um div container para a tabela para controlar overflow
    let tableContainer = document.createElement("div");
    tableContainer.classList.add("table-responsive");
    tableContainer.style.maxWidth = "800px";
    tableContainer.style.margin = "0 auto";
    tableContainer.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    tableContainer.style.borderRadius = "10px";
    tableContainer.style.overflow = "hidden";
    
    let table = document.createElement("table");
    table.classList.add("table", "table-hover", "mb-0");
    table.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    
    let thead = document.createElement("thead");
    thead.style.backgroundColor = "#ff69b4";
    thead.style.color = "white";
    
    let tbody = document.createElement("tbody");
    tbody.id = "productTableBody";
    
    const headerRow = document.createElement("tr");
    const headers = header;

    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        th.style.padding = "12px 15px";
        th.style.fontWeight = "bold";
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Adiciona as linhas de produtos
    const rows = data.toTableRows();
    rows.forEach(row => {
        // Estilização para cada célula da linha
        Array.from(row.cells).forEach(cell => {
            cell.style.padding = "12px 15px";
            cell.style.verticalAlign = "middle";
        });
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // Adiciona título acima da tabela
    let tableTitle = document.createElement("h3");
    tableTitle.textContent = "Lista de Produtos";
    tableTitle.style.color = "#ff69b4";
    tableTitle.style.textAlign = "center";
    tableTitle.style.marginBottom = "20px";
    tableTitle.style.fontFamily = "'Pacifico', cursive";
    
    // Container principal que terá o título e a tabela
    let mainContainer = document.createElement("div");
    mainContainer.classList.add("d-flex", "flex-column", "align-items-center");
    mainContainer.append(tableTitle, tableContainer);
    
    return mainContainer;
}

// Refreshes just the product list without recreating the entire UI
async function refreshProductList() {
    // Get the current table body
    const tableBody = document.getElementById("productTableBody");
    if (!tableBody) {
        console.log("Table body not found, returning to stock menu");
        await stockMenu();
        return;
    }
    
    // Clear current rows
    tableBody.innerHTML = "";
    
    // Refresh data from Firebase
    await data.rebuildList();
    
    // Add new rows with improved styling
    const rows = data.toTableRows();
    rows.forEach(row => {
        // Estilização para cada célula da linha
        Array.from(row.cells).forEach(cell => {
            cell.style.padding = "12px 15px";
            cell.style.verticalAlign = "middle";
        });
        tableBody.appendChild(row);
    });
    
    // Add click listeners to all rows
    const tableRows = tableBody.querySelectorAll("tr");
    tableRows.forEach(row => {
        row.addEventListener("click", function() {
            // Remove the class from all rows
            tableRows.forEach(r => r.classList.remove("table-success"));
            
            // Add custom selected class to the clicked row
            this.classList.add("table-success");
            this.style.backgroundColor = "rgba(255, 215, 235, 0.7)";
            
            // Store the reference for deletion
            window.selectedRef = this.cells[1].textContent;
            window.selectedRow = this;
        });
    });
}

export async function stockMenu() {
    await data.rebuildList();
    
    // Now create the table with headers
    let headers = ["Nome", "Referencia", "Imagem"];
    let tableComponent = genareteTable(headers);
    
    // Add the table to the main elements
    mainElements(tableComponent);
    
    // Get all rows (excluding header)
    const table = tableComponent.querySelector("table");
    const rows = table.querySelectorAll("tbody tr");
    let selectedRef;
    let selectedRow;
    let selectedName;
    let selectedId;
    
    // Add click listeners to all rows
    rows.forEach(row => {
        row.style.cursor = "pointer";
        row.style.transition = "background-color 0.2s";
        
        row.addEventListener("mouseover", function() {
            if (!this.classList.contains("table-success")) {
                this.style.backgroundColor = "rgba(255, 235, 245, 0.5)";
            }
        });
        
        row.addEventListener("mouseout", function() {
            if (!this.classList.contains("table-success")) {
                this.style.backgroundColor = "";
            }
        });
        
        row.addEventListener("click", function() {
            // Remove the selected class from all rows
            rows.forEach(r => {
                r.classList.remove("table-success");
                r.style.backgroundColor = "";
            });
            
            // Add the selected class to the clicked row
            this.classList.add("table-success");
            this.style.backgroundColor = "rgba(255, 215, 235, 0.7)";
            
            // Store the reference for deletion
            selectedRef = this.cells[1].textContent;
            selectedName = this.cells[0].textContent;
            selectedRow = this;
            selectedId = data.products[this.rowIndex - 1].getId();
            
            // Make these available globally
            window.selectedRef = selectedRef;
            window.selectedRow = selectedRow;
    
            console.log(selectedId);
        });
    });
    
    // Add delete button listener
    document.getElementById("deleteButton").addEventListener("click", async function() {
        if (!selectedRef) {
            alert("Por favor, selecione um produto para apagar");
            return;
        }
        
        if (confirm(`Tem certeza que deseja apagar o produto "${selectedName}"?`)) {
            data.deleteProduct(selectedRef);
            await stockMenu();
        }
    });
    
    // Add main button (add) listener
    document.getElementById("mainButton").addEventListener("click", function() {
        showAddProductForm();
    });

    document.getElementById("editButton").addEventListener("click", function(){
        if (!selectedRef) {
            alert("Por favor, selecione um produto para editar");
            return;
        }
        showAddProductForm(selectedName, selectedRef, selectedId);
    });
}

function showAddProductForm(name, ref, selectedId) {
    let forEdit = false;
    let mainPage = document.getElementById("mainPage");
    mainPage.replaceChildren();

    // Criar container principal para o formulário
    let formContainer = document.createElement("div");
    formContainer.classList.add("container", "mt-4", "p-4");
    formContainer.style.maxWidth = "500px";
    formContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    formContainer.style.borderRadius = "15px";
    formContainer.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
    
    // Criar título do formulário
    let formTitle = document.createElement("h3");
    formTitle.textContent = name && ref ? "Editar Produto" : "Adicionar Novo Produto";
    formTitle.classList.add("mb-4", "text-center");
    formTitle.style.color = "#ff69b4";
    formTitle.style.fontFamily = "'Pacifico', cursive";

    // Função para criar campos de formulário estilizados
    const createFormField = (id, labelText, value = "") => {
        const field = document.createElement("div");
        field.classList.add("mb-3");
        
        const label = document.createElement("label");
        label.textContent = labelText;
        label.htmlFor = id;
        label.style.color = "#ff69b4";
        label.style.fontWeight = "bold";
        label.style.marginBottom = "5px";
        
        const input = document.createElement("input");
        input.id = id;
        input.classList.add("form-control");
        input.style.borderRadius = "10px";
        input.style.border = "1px solid #ff69b4";
        input.style.padding = "10px";
        input.style.boxShadow = "none";
        input.value = value;
        
        // Adicionar efeito de foco
        input.addEventListener("focus", function() {
            this.style.boxShadow = "0 0 0 3px rgba(255, 105, 180, 0.25)";
        });
        
        input.addEventListener("blur", function() {
            this.style.boxShadow = "none";
        });
        
        field.append(label, input);
        return field;
    };

    // Criar campos de formulário
    const nameContainer = createFormField("nameBox", "Nome do Produto", name || "");
    const refContainer = createFormField("refBox", "Referência", ref || "");

    // Função para criar botões estilizados
    const createStyledButton = (text, isPrimary) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add("btn");
        
        if (isPrimary) {
            button.style.backgroundColor = "#ff69b4";
            button.style.color = "white";
            button.style.marginRight = "10px";
        } else {
            button.classList.add("btn-secondary");
        }
        
        button.style.borderRadius = "20px";
        button.style.padding = "8px 25px";
        button.style.fontWeight = "bold";
        button.style.border = "none";
        button.style.transition = "transform 0.2s, box-shadow 0.2s";
        
        // Adiciona efeito hover
        button.onmouseover = function() {
            this.style.transform = "translateY(-2px)";
            this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            if (isPrimary) this.style.backgroundColor = "#ff5ba7";
        };
        
        button.onmouseout = function() {
            this.style.transform = "translateY(0)";
            this.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            if (isPrimary) this.style.backgroundColor = "#ff69b4";
        };
        
        return button;
    };

    // Criar botões
    const addButton = createStyledButton("Guardar", true);
    const cancelButton = createStyledButton("Cancelar", false);

    // Container para botões
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("mt-4", "d-flex", "justify-content-center");
    buttonContainer.append(addButton, cancelButton);

    // Adicionar campos ao formulário
    formContainer.append(formTitle, nameContainer, refContainer, buttonContainer);
    mainPage.append(formContainer);

    if(name && ref){
        forEdit = true;
    }

    // Listener para o botão de adicionar/guardar
    addButton.addEventListener("click", async function() {
        let newName = document.getElementById("nameBox").value;
        let newRef = document.getElementById("refBox").value;
        
        if (!newName || !newRef) {
            alert("Por favor, preencha todos os campos");
            return;
        }
        
        if(forEdit){
            data.updateProduct(newName, newRef, selectedId);
            await stockMenu();
            return;
        }
        
        await data.createProduct(null, newName, newRef, "NA");
        await stockMenu();
    });
    
    // Listener para o botão cancelar
    cancelButton.addEventListener("click", async function() {
        await stockMenu();
    });
}