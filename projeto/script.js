import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// Função para buscar usuários do Firestore
async function getProduct() {
  try {
    // Usar as funções importadas corretamente
    const productsCollection = collection(db, "products");
    const usersSnapshot = await getDocs(productsCollection);
    
    console.log("Total de usuários encontrados:", usersSnapshot.size);
    
    usersSnapshot.forEach((doc) => {
      data.rebuildList(doc.data().name, doc.data().ref, "NA");
    });
    
    return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
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
        img: "NA"
      });
  
      console.log("Produto adicionado com ID:", docRef.id);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
}

getProduct();


class ProductClass{
    constructor(name, ref, img){
        this.name = name;
        this.ref = ref;
        this.img = img;
    }

    getName(){
        return this.name;
    }

    getRef(){
        return this.ref;
    }
}

class Order{
    constructor(name, date){
        this.name = name;
        this.date = date;
    }

    getName(){
        return this.name;
    }

    getDate(){
        return this.date;
    }
}

class Sale{
    constructor(product, catalogPrice, finalPrice, buyer){
        this.product = product;
        this.price = finalPrice;
        this.buyer = buyer;
        this.catalogPrice = catalogPrice;
    }

    getProduct(){
        return this.product;
    }

    getFinalPrice(){
        return this.price;
    }

    getCatalogPrice(){
        return this.catalogPrice;
    }

    getBuyer(){
        return this.buyer;
    }
}

class InfoHolder{
    constructor() {
        if (!InfoHolder.instance) {
            this.products = [];
            InfoHolder.instance = this;
        }
        return InfoHolder.instance;
    }

    createProduct(name, ref, img){
        let newProduct = new ProductClass(name, ref, img);
        this.products.push(newProduct);
        addProduct(name, ref);
    }

    rebuildList(name, ref, img){
        let newProduct = new ProductClass(name, ref, img);
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

function mainElements(elements){
    let mainDiv = document.getElementById("mainPage");
    let buttonContainer = document.createElement("div");
    let elementsContainer = document.createElement("div");

    buttonContainer.id = "buttonContainer";
    elementsContainer.id = "elementsContainer";

    buttonContainer.classList.add("d-flex");
    buttonContainer.classList.add("gap-3");
    buttonContainer.classList.add("justify-content-center");

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

    let deleteButton = document.createElement("button");
    let deletebuttonText = "Apagar";
    deleteButton.textContent = deletebuttonText;
    deleteButton.style.color = "white";
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-sm");
    deleteButton.style.backgroundColor = "#ff69b4";
    
    elementsContainer.append(elements);
    buttonContainer.append(addButton, editButton, deleteButton);
    mainDiv.append(elementsContainer, buttonContainer);
}

function genareteTable(header){
    let table = document.createElement("table");
    table.classList.add("table", "table-bordered", "table-striped", "table-primary");

    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    
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

function stockMenu(){
    let headers = ["Nome", "Referencia", "Imagem"];
    let table = genareteTable(headers);
   
    mainElements(table);

    document.getElementById("mainButton").addEventListener("click", function() {
        let mainPage = document.getElementById("mainPage");
        mainPage.replaceChildren();
    
        let nameBox = document.createElement("input");
        nameBox.id = "nameBox";
    
        let labelForNameBox = document.createElement("label");
        labelForNameBox.textContent = "Nome do Produto";
        labelForNameBox.style.color = "#ff69b4";
        labelForNameBox.style.fontWeight = "bold";
        labelForNameBox.htmlFor = "nameBox";
    
        let nameContainer = document.createElement("div");
        nameContainer.classList.add("input-container");
        nameContainer.append(labelForNameBox, nameBox);
    
        let refBox = document.createElement("input");
        refBox.id = "refBox";
    
        let labelFoRrefBox = document.createElement("label");
        labelFoRrefBox.textContent = "Referência";
        labelFoRrefBox.style.color = "#ff69b4";
        labelFoRrefBox.style.fontWeight = "bold";
        labelFoRrefBox.htmlFor = "refBox";

        let addButton = document.createElement("button");
        let addbuttonText = "Adicionar";
        addButton.textContent = addbuttonText;
        addButton.style.color = "white";
        addButton.classList.add("btn");
        addButton.classList.add("btn-sm");
        addButton.style.backgroundColor = "#ff69b4";
    
        let refContainer = document.createElement("div");
        refContainer.classList.add("input-container");
        refContainer.append(labelFoRrefBox, refBox);

        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("form-container");
        buttonContainer.append(addButton);
    
        let formContainer = document.createElement("div");
        formContainer.classList.add("form-container");
        formContainer.append(nameContainer, refContainer);

        mainPage.append(formContainer, buttonContainer);

        addButton.addEventListener("click", function(){
            let name = nameBox.value;
            let ref = refBox.value;
            let img = "NA";
            data.createProduct(name, ref, img);
            stockMenu();
        });
    });
}

// Exportar funções para o escopo global
window.appFunctions = {
  stockMenu: stockMenu,
  getProduct: getProduct,
  addProduct: addProduct
};

// Também exportar stockMenu individualmente para compatibilidade com o código existente
window.stockMenu = stockMenu;