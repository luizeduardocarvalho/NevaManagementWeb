export interface CreateProductDto {
    name: string;
    description: string;
    locationId: number | null;
    unit: string;
    quantity: number;
    formula: string;
}