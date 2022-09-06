import { GetLocation } from '../location/get-location.dto';

export interface IGetDetailedProduct {
  id: number;
  name: string;
  description: string;
  location: GetLocation;
  quantity: number;
  quantityUsedInTheLastThreeMonths: number;
  unit: string;
  formula: string;
  expirationDate: Date;
}
