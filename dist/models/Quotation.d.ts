export type QuotationOptionTag = 'cheaper' | 'faster';
export type QuotationOption = {
    gateway: string;
    company: string;
    service: string;
    price: number;
    deliveryEstimate?: string;
    tags?: Array<QuotationOptionTag>;
};
export interface Quotation {
    options: QuotationOption[];
    _metadata?: any[];
}
