export class GetLastProduct {
    productId: number;
    productName: string;
    locationName: string;
    quantity: number;
    unit: string;

    constructor(
        productId: number,
        productName: string,
        locationName: string,
        quantity: number,
        unit: string
    ) {
        this.productId = productId
        this.productName = productName
        this.locationName = locationName
        this.quantity = quantity
        this.unit = unit
    }
}