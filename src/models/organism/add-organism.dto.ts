export class AddOrganism {
    name: string;
    type: string;
    description: string;
    collectionDate: Date;
    collectionLocation: string;
    isolationDate: Date;
    originOrganismId: number | null;
    originPart: string;

    constructor(
        name: string,
        type: string,
        description: string,
        collectionDate: Date,
        collectionLocation: string,
        isolationDate: Date,
        originOrganismId: number | null,
        originPart: string
    ) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.collectionDate = collectionDate;
        this.collectionLocation = collectionLocation;
        this.isolationDate = isolationDate;
        this.originOrganismId = originOrganismId;
        this.originPart = originPart;
    }
}