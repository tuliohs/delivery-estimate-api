import type { Quotation } from "../../models/Quotation";
import type { QuotationRequest } from "../../models/Shipping";
import type { QuotationAdapter } from "../core/types/QuotationAdapter";
export declare const sanitize: (name: string) => string;
export default class FlexQuotation implements QuotationAdapter {
    private servicedCities;
    constructor();
    private getDeliveryDate;
    quotation(quotation: QuotationRequest): Promise<Quotation>;
}
