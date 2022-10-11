export interface ICreateForm {
    label: string;
    type: string;
    options?: { key: string; value: string }[];
    order: number;
    key: string;
    value?: string;
    disabled?: boolean;
    required?: boolean;
}