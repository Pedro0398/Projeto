

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
        return this.price; // Corrigido: era this.finalPrice, mas a propriedade é this.price
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
            InfoHolder.instance = this; // Garante que só existe uma instância
        }
        return InfoHolder.instance;
    }

    createProduct(name, ref, img){
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
    
    // Aqui está o problema - textContent não é um método, é uma propriedade
    let addButton = document.createElement("button");
    let addbuttonText = "Adicionar"; // Apenas uma string
    addButton.textContent = addbuttonText; // Define o texto do botão
    addButton.style.color = "white"; // Define a cor do texto
    addButton.classList.add("btn");
    addButton.classList.add("btn-sm");
    addButton.style.backgroundColor = "#ff69b4";
    addButton.id = "mainButton";

    let editButton = document.createElement("button");
    let editbuttonText = "Editar"; // Apenas uma string
    editButton.textContent = editbuttonText; // Define o texto do botão
    editButton.style.color = "white"; // Define a cor do texto
    editButton.classList.add("btn");
    editButton.classList.add("btn-sm");
    editButton.style.backgroundColor = "#ff69b4";

    let deleteButton = document.createElement("button");
    let deletebuttonText = "Apagar"; // Apenas uma string
    deleteButton.textContent = deletebuttonText; // Define o texto do botão
    deleteButton.style.color = "white"; // Define a cor do texto
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-sm");
    deleteButton.style.backgroundColor = "#ff69b4";
    
    elementsContainer.append(elements);
    buttonContainer.append(addButton, editButton, deleteButton);
    mainDiv.append(elementsContainer, buttonContainer);
    
}

function genareteTable(header){
    let table = document.createElement("table");
    table.classList.add("table", "table-bordered", "table-striped", "table-primary"); // Adiciona classes do Bootstrap


    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    
    // Criar cabeçalho da tabela
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
    
        // Criar Input e Label para Nome do Produto
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
    
        // Criar Input e Label para Referência
        let refBox = document.createElement("input");
        refBox.id = "refBox";
    
        let labelFoRrefBox = document.createElement("label");
        labelFoRrefBox.textContent = "Referência";
        labelFoRrefBox.style.color = "#ff69b4";
        labelFoRrefBox.style.fontWeight = "bold";
        labelFoRrefBox.htmlFor = "refBox";

        let addButton = document.createElement("button");
        let addbuttonText = "Adicionar"; // Apenas uma string
        addButton.textContent = addbuttonText; // Define o texto do botão
        addButton.style.color = "white"; // Define a cor do texto
        addButton.classList.add("btn");
        addButton.classList.add("btn-sm");
        addButton.style.backgroundColor = "#ff69b4";
    
        let refContainer = document.createElement("div");
        refContainer.classList.add("input-container");
        refContainer.append(labelFoRrefBox, refBox);

        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("form-container");
        buttonContainer.append(addButton);
    
        // Criar um container principal para centrar os elementos
        let formContainer = document.createElement("div");
        formContainer.classList.add("form-container");
        formContainer.append(nameContainer, refContainer);

    
        mainPage.append(formContainer, buttonContainer);

        addButton.addEventListener("click", function(){
            let name = nameBox.value;
            let ref = refBox.value;
            let img = "NA";
            data.createProduct(name, ref, img)
            stockMenu();
        });
    });
    
    
}