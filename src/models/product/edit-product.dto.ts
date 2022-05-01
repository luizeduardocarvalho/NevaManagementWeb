export class EditProduct {
    id: number;
    name: string;
    locationId: number | null;
    description: string;
    formula: string;

    constructor(
        id: number,
        name: string,
        locationId: number | null,
        description: string,
        formula: string
    ) {
        this.id = id;
        this.name = name;
        this.locationId = locationId;
        this.description = description;
        this.formula = formula;
    }
}