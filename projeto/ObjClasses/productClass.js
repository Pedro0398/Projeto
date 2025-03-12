export class ProductClass {
    constructor(id = null, name, ref, img) {
        this.name = name;
        this.ref = ref;
        this.img = img;
        this.id = id; // Store Firestore document ID
    }

    getId(){
        return this.id;
    }

    getName() {
        return this.name;
    }

    getRef() {
        return this.ref;
    }
}