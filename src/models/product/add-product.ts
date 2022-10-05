export interface IAddProduct {
  name: string;
  description: string;
  locationId: number;
  unit: string;
  quantity: number;
  formula: string;
  expirationDate: Date | undefined;
}
