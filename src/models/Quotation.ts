
export type QuotationOptionTag = 'cheaper' | 'faster'

export type QuotationOption = {
    gateway: string;
    company: string;
    service: string;
    price: number;
    deliveryEstimate?: string;
    tags?: Array<QuotationOptionTag>;
}
export interface Quotation {
    options: QuotationOption[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _metadata?: any[];
}