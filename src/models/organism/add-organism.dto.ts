export interface IAddOrganism {
  name: string;
  type: string;
  description: string;
  collectionDate: Date;
  collectionLocation: string;
  isolationDate: Date;
  originOrganismId: number | null;
  originPart: string;
}
