export class EditLocation {
    id: number;
    name: string;
    description: string;
    subLocationId: number | null;

    constructor(
        id: number,
        name: string,
        description: string,
        subLocationId: number | null
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.subLocationId = subLocationId;
    }
}