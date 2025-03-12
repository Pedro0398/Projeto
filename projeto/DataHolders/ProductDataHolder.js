import { FirebaseService } from "../FireBase/firebaseService.js";
import { ProductClass } from "../ObjClasses/productClass.js";

export class ProductDataManager {
    constructor() {
            this.products = [];
            this.firebaseService = new FirebaseService();
       
    }

    createProduct(id, name, ref, img) {
            let newProduct = new ProductClass(id, name, ref, img);
            this.products.push(newProduct);
            this.firebaseService.addProduct(name, ref, img);
    }

    async rebuildList() {
        this.products = [];
        let newProducts = await this.firebaseService.getCollection("products");
        newProducts.forEach(product => {
            let newProduct = new ProductClass(product.id, product.name, product.ref, product.img);
            this.products.push(newProduct);
        });
        
           
    }

    updateProduct(name, ref, id){
        this.firebaseService.updateCollection("products", name, ref, id)
    }

    getProducts(){
        return this.products;
    }

    deleteProduct(ref){
        let productToDelete = this.products.find(product => product.ref === ref);
        this.firebaseService.deleteProduct(productToDelete.id);
        this.products.pop(productToDelete);
    }

    toTableRows() {
        let rows = this.products.map(product => {
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
        console.log(rows);
        return rows;
    }
}