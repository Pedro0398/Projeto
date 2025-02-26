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

class infoHolder{
    constructor(){
        this.products = [];
        this.sales = [];
    }

    createProduct(name, ref, img){
        let newProduct = new ProductClass(name, ref, img);
        this.products.push(newProduct);
    }
}

function mainElements(elements){
    let mainDiv = document.getElementById("mainPage");
    let buttonContainer = document.createElement("div");
    let elementsContainer = document.createElement("div");

    buttonContainer.classList.add("d-flex");
    buttonContainer.classList.add("gap-3");
    buttonContainer.classList.add("justify-content-center");

    elementsContainer.classList.add("justify-content-center");

    document.getElementById("main").classList.toggle("d-none");
    
    // Aqui está o problema - textContent não é um método, é uma propriedade
    let addButton = document.createElement("button");
    let addbuttonText = "Adicionar"; // Apenas uma string
    addButton.textContent = addbuttonText; // Define o texto do botão
    addButton.style.color = "white"; // Define a cor do texto
    addButton.classList.add("btn");
    addButton.classList.add("btn-sm");
    addButton.style.backgroundColor = "#ff69b4";

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

    // Criar linhas da tabela
    const data = [
        { id: 1, nome: "João", idade: 25 },
        { id: 2, nome: "Maria", idade: 30 },
        { id: 3, nome: "Carlos", idade: 22 }
    ];

    data.forEach(item => {
        const row = document.createElement("tr");

        Object.values(item).forEach(text => {
            const td = document.createElement("td");
            td.textContent = text;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    return table;
}

function stockMenu(){
    let headers = ["Nome", "Referencia", "Imagem"];
    let table = genareteTable(headers);
    mainElements(table);
}