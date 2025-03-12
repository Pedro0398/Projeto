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