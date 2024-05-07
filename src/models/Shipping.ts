import type { Customer } from "./Customer";

export interface Package {
    id?: string;
    weight: number;
    height: number;
    width: number;
    length: number;
    description?: string;
    insurancePrice: number;
}

export interface QuotationRequest {
    customerFrom: Customer
    customerTo: Customer
    package: Package;
}

export interface Shipping {
    id?: string;
    package: Package;
    shippingInfo: {
        gateway: string;
        company: string;
        service: string;
    }
    price: number
    date: number
}    