import { GetLocation } from "../location/get-location.dto";

export class GetDetailedProduct {
    id: number;
    name: string;
    description: string;
    location: GetLocation;
    quantity: number;
    unit: string;
    formula: string;
    expirationDate: Date;

    constructor(
        id: number,
        name: string,
        description: string,
        location: GetLocation,
        quantity: number,
        unit: string,
        formula: string,
        expirationDate: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.quantity = quantity;
        this.unit = unit;
        this.formula = formula;
        this.expirationDate = expirationDate;
    }
}