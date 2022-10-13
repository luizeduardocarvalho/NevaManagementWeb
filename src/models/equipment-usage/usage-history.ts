import { IGetSimpleResearcher } from "../researcher/get-simple-researcher";

export interface IUsageHistory {
    researcher: IGetSimpleResearcher;
    startDate: Date;
    endDate: Date;
}