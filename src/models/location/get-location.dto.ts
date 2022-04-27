export class GetLocation {
    id: number;
    name: string;
    description: string;
    sublocation?: GetLocation | null;

    constructor(
        name: string,
        description: string,
        sublocation: GetLocation | null,
        id: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sublocation = sublocation;
    }
}