export interface IAddContainer {
  name: string;
  description: string;
  cultureMedia: string;
  organismId: number | null;
  subContainerId: number | null;
  researcherId: number | null;
  creationDate: Date;
  transferDate: Date;
}
