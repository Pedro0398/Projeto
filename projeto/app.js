import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA2QDJJb0LXEkEaqHx74n7yMoBsu6GEQ6g",
    authDomain: "boticario-b56db.firebaseapp.com",
    databaseURL: "https://boticario-b56db-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "boticario-b56db",
    storageBucket: "boticario-b56db.firebasestorage.app",
    messagingSenderId: "161696311980",
    appId: "1:161696311980:web:f6e59819d2b9136e054d09",
    measurementId: "G-HS8BTHKJMR"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para buscar os produtos da coleção "products"
async function getProduct() {
  const produtosRef = collection(db, "products"); // Acessa a coleção "products"
  const snapshot = await getDocs(produtosRef);   // Obtém os documentos

  snapshot.forEach((doc) => {
    data.createProduct(doc.data().name, doc.data().ref, "NA");
  });

}

class ProductClass {
    constructor(name, ref, img, id = null) {
        this.name = name;
        this.ref = ref;
        this.img = img;
        this.id = id; // Store Firestore document ID
    }

    getName() {
        return this.name;
    }

    getRef() {
        return this.ref;
    }
}

class Order {
    constructor(name, date) {
        this.name = name;
        this.date = date;
    }

    getName() {
        return this.name;
    }

    getDate() {
        return this.date;
    }
}

class Sale {
    constructor(product, catalogPrice, finalPrice, buyer) {
        this.product = product;
        this.price = finalPrice;
        this.buyer = buyer;
        this.catalogPrice = catalogPrice;
    }

    getProduct() {
        return this.product;
    }

    getFinalPrice() {
        return this.price;
    }

    getCatalogPrice() {
        return this.catalogPrice;
    }

    getBuyer() {
        return this.buyer;
    }
}

class InfoHolder {
    constructor() {
        if (!InfoHolder.instance) {
            this.products = [];
            InfoHolder.instance = this;
        }
        return InfoHolder.instance;
    }

    createProduct(name, ref, img) {
            let newProduct = new ProductClass(name, ref, img);
            this.products.push(newProduct);
    }

    rebuildList(name, ref, img, id = null) {
        let newProduct = new ProductClass(name, ref, img, id);
        this.products.push(newProduct);
    }

    toTableRows() {
        return this.products.map(product => {
            const row = document.createElement("tr");

            const nameTd = document.createElement("td");
            nameTd.textContent = product.name;
            row.appendChild(nameTd);

            const refTd = document.createElement("td");
            refTd.textContent = product.ref;
            row.appendChild(refTd);

            const imgTd = document.createElement("td");
            if (product.img !== "NA") {
                const imgElement = document.createElement("img");
                imgElement.src = product.img;
                imgElement.style.width = "50px";
                imgTd.appendChild(imgElement);
            } else {
                imgTd.textContent = "Sem imagem";
            }
            row.appendChild(imgTd);

            return row;
        });
    }
}

let data = new InfoHolder();

function mainElements(elements) {
    let mainDiv = document.getElementById("mainPage");
    let buttonContainer = document.createElement("div");
    let elementsContainer = document.createElement("div");

    buttonContainer.id = "buttonContainer";
    elementsContainer.id = "elementsContainer";

    buttonContainer.classList.add("d-flex");
    buttonContainer.classList.add("gap-3");
    buttonContainer.classList.add("justify-content-center");
    buttonContainer.classList.add("mt-3");

    elementsContainer.classList.add("justify-content-center");

    mainDiv.replaceChildren();
    
    let addButton = document.createElement("button");
    let addbuttonText = "Adicionar";
    addButton.textContent = addbuttonText;
    addButton.style.color = "white";
    addButton.classList.add("btn");
    addButton.classList.add("btn-sm");
    addButton.style.backgroundColor = "#ff69b4";
    addButton.id = "mainButton";

    let editButton = document.createElement("button");
    let editbuttonText = "Editar";
    editButton.textContent = editbuttonText;
    editButton.style.color = "white";
    editButton.classList.add("btn");
    editButton.classList.add("btn-sm");
    editButton.style.backgroundColor = "#ff69b4";
    editButton.id = "editButton";

    let deleteButton = document.createElement("button");
    let deletebuttonText = "Apagar";
    deleteButton.textContent = deletebuttonText;
    deleteButton.style.color = "white";
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-sm");
    deleteButton.style.backgroundColor = "#ff69b4";
    deleteButton.id = "deleteButton";
    
    elementsContainer.append(elements);
    buttonContainer.append(addButton, editButton, deleteButton);
    mainDiv.append(elementsContainer, buttonContainer);
}

function genareteTable(header) {
    let table = document.createElement("table");
    table.classList.add("table", "table-bordered", "table-striped", "table-hover", "table-primary");
    table.style.maxWidth = "800px";
    table.style.margin = "0 auto";

    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    tbody.id = "productTableBody";
    
    const headerRow = document.createElement("tr");
    const headers = header;

    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    data.toTableRows().forEach(row => tbody.appendChild(row));

    table.appendChild(tbody);

    return table;
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
    await getProduct();
    
    // Add new rows
    data.toTableRows().forEach(row => tableBody.appendChild(row));
    
    // Add click listeners to all rows
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach(row => {
        row.addEventListener("click", function() {
            // Remove the class from all rows
            rows.forEach(r => r.classList.remove("table-success"));
            
            // Add the class to the clicked row
            this.classList.add("table-success");
            
            // Store the reference for deletion
            window.selectedRef = this.cells[1].textContent;
            window.selectedRow = this;
        });
    });
}

async function stockMenu() {
    
    // Now create the table with headers
    let headers = ["Nome", "Referencia", "Imagem"];
    let table = genareteTable(headers);
    
    // Add the table to the main elements
    mainElements(table);
    
    // Get all rows
    const rows = table.querySelectorAll("tr");
    let selectedRef;
    let selectedRow;
    
    // Add click listeners to all rows
    rows.forEach(row => {
        row.addEventListener("click", function() {
            // Don't add listeners to header row
            if (this.parentElement.tagName.toLowerCase() === "thead") {
                return;
            }
            
            // Remove the class from all rows
            rows.forEach(r => r.classList.remove("table-success"));
            
            // Add the class to the clicked row
            this.classList.add("table-success");
            
            // Store the reference for deletion
            selectedRef = this.cells[1].textContent;
            selectedRow = this;
            
            // Make these available globally
            window.selectedRef = selectedRef;
            window.selectedRow = selectedRow;
            
            console.log("Linha selecionada:", selectedRef);
        });
    });
    
    // Add delete button listener
    document.getElementById("deleteButton").addEventListener("click", async function() {
        if (window.selectedRef) {
            const success = await deleteProductByRef(window.selectedRef);
            if (success) {
                await refreshProductList();
            }
        } else {
            alert("Selecione um produto para apagar");
        }
    });
    
    // Add main button (add) listener
    document.getElementById("mainButton").addEventListener("click", function() {
        showAddProductForm();
    });
}

function showAddProductForm() {
    let mainPage = document.getElementById("mainPage");
    mainPage.replaceChildren();

    let nameBox = document.createElement("input");
    nameBox.id = "nameBox";
    nameBox.classList.add("form-control");

    let labelForNameBox = document.createElement("label");
    labelForNameBox.textContent = "Nome do Produto";
    labelForNameBox.style.color = "#ff69b4";
    labelForNameBox.style.fontWeight = "bold";
    labelForNameBox.htmlFor = "nameBox";

    let nameContainer = document.createElement("div");
    nameContainer.classList.add("mb-3");
    nameContainer.append(labelForNameBox, nameBox);

    let refBox = document.createElement("input");
    refBox.id = "refBox";
    refBox.classList.add("form-control");

    let labelForRefBox = document.createElement("label");
    labelForRefBox.textContent = "Referência";
    labelForRefBox.style.color = "#ff69b4";
    labelForRefBox.style.fontWeight = "bold";
    labelForRefBox.htmlFor = "refBox";

    let refContainer = document.createElement("div");
    refContainer.classList.add("mb-3");
    refContainer.append(labelForRefBox, refBox);

    let addButton = document.createElement("button");
    addButton.textContent = "Adicionar";
    addButton.style.color = "white";
    addButton.classList.add("btn");
    addButton.classList.add("btn-primary");
    addButton.style.backgroundColor = "#ff69b4";
    addButton.style.marginRight = "10px";

    let cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancelar";
    cancelButton.classList.add("btn");
    cancelButton.classList.add("btn-secondary");

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("mt-4");
    buttonContainer.append(addButton, cancelButton);

    let formContainer = document.createElement("div");
    formContainer.classList.add("container");
    formContainer.classList.add("mt-4");
    formContainer.style.maxWidth = "500px";
    
    let formTitle = document.createElement("h3");
    formTitle.textContent = "Adicionar Novo Produto";
    formTitle.classList.add("mb-4");
    formTitle.style.color = "#ff69b4";
    
    formContainer.append(formTitle, nameContainer, refContainer, buttonContainer);

    mainPage.append(formContainer);

    // Add button listener
    addButton.addEventListener("click", async function() {
        let name = nameBox.value;
        let ref = refBox.value;
        
        if (!name || !ref) {
            alert("Por favor, preencha todos os campos");
            return;
        }
        
        const success = await data.createProduct(name, ref, "NA");
        if (success) {
            await stockMenu();
        }
    });
    
    // Cancel button listener
    cancelButton.addEventListener("click", async function() {
        await stockMenu();
    });
}

// Initialize - load products when page loads
document.addEventListener('DOMContentLoaded', async function() {
    await getProduct();
    
    document.getElementById('stockImg').addEventListener('click', async function() {
        await stockMenu();
    });
});


