export class EditProduct {
    id: number;
    name: string;
    locationId: number | null;
    description: string;

    constructor(
        id: number,
        name: string,
        locationId: number | null,
        description: string
    ) {
        this.id = id;
        this.name = name;
        this.locationId = locationId;
        this.description = description;
    }
}