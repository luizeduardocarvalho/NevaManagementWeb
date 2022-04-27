export class GetDetailedLocation {
    name: string;
    description: string;
    subLocationId: number;
    subLocationName: string;

    constructor(
        name: string, 
        description: string, 
        subLocationId: number, 
        subLocationName: string) {
        this.name = name;
        this.description = description;
        this.subLocationId = subLocationId;
        this.subLocationName = subLocationName;
    }
}