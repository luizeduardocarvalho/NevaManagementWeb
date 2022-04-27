export class UseProduct {
    researcherId: number;
    productId: number;
    quantity: number;
    description: string;

    constructor(
        researcherId: number,
        productId: number,
        quantity: number,
        description: string) {
        this.researcherId = researcherId;
        this.productId = productId;
        this.quantity = quantity;
        this.description = description;
    }
}