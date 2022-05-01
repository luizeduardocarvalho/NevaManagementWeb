export class EditProduct {
    id: number;
    name: string;
    locationId: number | null;
    description: string;
    formula: string;
    expirationDate: Date;

    constructor(
        id: number,
        name: string,
        locationId: number | null,
        description: string,
        formula: string,
        expirationDate: Date
    ) {
        this.id = id;
        this.name = name;
        this.locationId = locationId;
        this.description = description;
        this.formula = formula;
        this.expirationDate = expirationDate;
    }
}