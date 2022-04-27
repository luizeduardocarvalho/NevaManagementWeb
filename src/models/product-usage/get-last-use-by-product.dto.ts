export class GetLastUseByProduct {
    researcherName: string;
    useDate: Date;
    quantity: number;
    unit: string;

    constructor(
        researcherName: string,
        useDate: Date,
        quantity: number,
        unit: string
    ) {
        this.researcherName = researcherName;
        this.useDate = useDate;
        this.quantity = quantity;
        this.unit = unit;
    }
}