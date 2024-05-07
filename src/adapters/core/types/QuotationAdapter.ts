import type { Quotation } from "../../../models/Quotation";
import type { QuotationRequest } from "../../../models/Shipping";

export interface QuotationAdapter {
    quotation(quotation: QuotationRequest): Promise<Quotation>
}