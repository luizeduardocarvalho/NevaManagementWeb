export class ProductUsage {
    name: string;
    usageDate: Date;
    quantity: number;
    unit: string;

    constructor(
        name: string,
        usageDate: Date,
        quantity: number,
        unit: string
    ) {
        this.name = name;
        this.usageDate = usageDate;
        this.quantity = quantity;
        this.unit = unit;
    }
}