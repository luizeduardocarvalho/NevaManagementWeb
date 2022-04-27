export class AddLocation {
    name: string;
    description: string;
    sublocationid: number | null;

    constructor(name: string, description: string, sublocationid: number | null) {
        this.name = name;
        this.description = description;
        this.sublocationid = sublocationid;
    }
}