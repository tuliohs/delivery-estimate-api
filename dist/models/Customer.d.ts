export interface Customer {
    id?: string;
    name: string;
    adress: {
        zipCode: string;
        street: string;
        addressNumber: string;
        complement: string;
        city: string;
        state: string;
        country: string;
    };
    phone?: string;
    main?: string;
    created?: number;
}
