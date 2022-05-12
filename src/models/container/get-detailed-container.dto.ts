export class GetDetailedContainer {
    name: string;
    cultureMedia: string;
    researcherName: string;
    description: string;
    originName: string;
    creationDate: Date;

    constructor(
        name: string,
        cultureMedia: string,
        researcherName: string,
        description: string,
        originName: string,
        creationDate: Date
    ) {
        this.name = name;
        this.cultureMedia = cultureMedia;
        this.researcherName = researcherName;
        this.description = description;
        this.originName = originName;
        this.creationDate = creationDate;
    }
}
