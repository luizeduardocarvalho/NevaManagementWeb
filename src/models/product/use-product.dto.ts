export class UseProduct {
    researcherId: number;
    productId: number;
    quantity: number;
    description: string;
    unit: string;

    constructor(
        researcherId: number,
        productId: number,
        quantity: number,
        description: string,
        unit: string) {
        this.researcherId = researcherId;
        this.productId = productId;
        this.quantity = quantity;
        this.description = description;
        this.unit = unit;
    }
}