import { GetLocation } from "../location/get-location.dto";

export class GetDetailedProduct {
    id: number;
    name: string;
    description: string;
    location: GetLocation;
    quantity: number;
    unit: string;
    formula: string;

    constructor(
        id: number,
        name: string,
        description: string,
        location: GetLocation,
        quantity: number,
        unit: string,
        formula: string) 
        {
            this.id = id;
            this.name = name;
            this.description = description;
            this.location = location;
            this.quantity = quantity;
            this.unit = unit;
            this.formula = formula;
        }
}