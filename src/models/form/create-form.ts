export interface ICreateForm {
    label: string;
    type: string;
    options?: { key: string; value: string }[];
    order: number;
    key: string;
    value?: string;
    required?: boolean;
}