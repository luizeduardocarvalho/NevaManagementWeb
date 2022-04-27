export class AddContainer {
    name: string;
    description: string;
    cultureMedia: string;
    organismId: number | null;
    subContainerId: number | null;
    researcherId: number | null;
    creationDate: Date;

    constructor(
        name: string,
        description: string,
        cultureMedia: string,
        organismId: number,
        subContainerId: number,
        researcherId: number | null,
        creationDate: Date
    ) {
        this.name = name;
        this.description = description;
        this.cultureMedia = cultureMedia;
        this.organismId = organismId;
        this.subContainerId = subContainerId;
        this.researcherId = researcherId;
        this.creationDate = creationDate;
    }
}