export interface DocumentType {
    id: string;
    name: string;
    required: boolean;
}

export const REQUIRED_DOCUMENTS: DocumentType[] = [
    {
        id: 'nic',
        name: 'NIC',
        required: true,
    },
    {
        id: 'passport',
        name: 'Passport',
        required: true,
    },
    {
        id: 'income-tax',
        name: 'Income Tax Report',
        required: true,
    }
];
