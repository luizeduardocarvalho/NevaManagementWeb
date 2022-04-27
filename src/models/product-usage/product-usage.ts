export class ProductUsage {
    productName: string;
    usageDate: Date;
    quantity: number;
    unit: string;


    constructor(
        productName: string,
        usageDate: Date,
        quantity: number,
        unit: string
    ) {
        this.productName = productName
        this.usageDate = usageDate
        this.quantity = quantity
        this.unit = unit
    }
}