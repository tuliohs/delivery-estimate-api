export interface Quotation {
    options: {
        gateway: string;
        company: string;
        service: string;
        price: number;
        deliveryEstimate?: string;
    }[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _metadata?: any[];
}