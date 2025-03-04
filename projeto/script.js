import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

console.log("Firebase inicializado com sucesso!");

// Função para buscar produtos do Firestore
async function getProduct() {
  try {
    // Reset the products list before loading from Firebase
    data.products = [];
    
    // Usar as funções importadas corretamente
    const productsCollection = collection(db, "products");
    const productsSnapshot = await getDocs(productsCollection);
    
    console.log("Total de produtos encontrados:", productsSnapshot.size);
    
    productsSnapshot.forEach((doc) => {
      data.rebuildList(doc.data().name, doc.data().ref, doc.data().img || "NA", doc.id);
    });
    
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

async function addProduct(name, ref, img) {
    try {
      // Referência à coleção "products"
      const productsCollection = collection(db, "products");
  
      // Adicionar um novo documento à coleção
      const docRef = await addDoc(productsCollection, {
        name: name,
        ref: ref,
        img: img || "NA"
      });
  
      console.log("Produto adicionado com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
}

async function deleteProductByRef(ref) {
  try {
    // Find documents where ref equals the provided ref
    const productsCollection = collection(db, "products");
    const q = query(productsCollection, where("ref", "==", ref));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("Nenhum produto encontrado com a referência:", ref);
      return false;
    }
    
    // Delete each matching document
    const deletePromises = [];
    querySnapshot.forEach((document) => {
      console.log("Deletando produto com ID:", document.id);
      deletePromises.push(deleteDoc(doc(db, "products", document.id)));
    });
    
    await Promise.all(deletePromises);
    console.log("Produto(s) deletado(s) com sucesso");
    
    // Update local data
    data.products = data.products.filter(product => product.ref !== ref);
    
    return true;
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return false;
  }
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

    async createProduct(name, ref, img) {
        try {
            // Add to Firebase first
            const docId = await addProduct(name, ref, img);
            
            // Then add to local data with the document ID
            let newProduct = new ProductClass(name, ref, img, docId);
            this.products.push(newProduct);
            
            return true;
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            return false;
        }
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
    // First, load the latest data from Firebase
    await getProduct();
    
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

// Exportar funções para o escopo global
window.appFunctions = {
    stockMenu: stockMenu,
    getProduct: getProduct,
    addProduct: addProduct,
    deleteProductByRef: deleteProductByRef,
    refreshProductList: refreshProductList
};

// Export individual functions for compatibility
window.stockMenu = stockMenu;
window.refreshProductList = refreshProductList;
window.deleteProductByRef = deleteProductByRef;

export {
    stockMenu,
    getProduct,
    addProduct,
    deleteProductByRef,
    refreshProductList
};