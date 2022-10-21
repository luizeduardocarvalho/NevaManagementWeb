import { ISimpleLocation } from "../location/get-simple-location.dto";

export interface IGetDetailedEquipment {
  name: string;
  description: string;
  propertyNumber: string;
  location: ISimpleLocation;
}
