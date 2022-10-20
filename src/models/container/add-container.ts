export interface IAddContainer {
  name: string;
  description: string;
  cultureMedia: string;
  organismId: number | null;
  subContainerId?: number;
  researcherId: number | null;
  creationDate: Date;
  transferDate: Date;
}
