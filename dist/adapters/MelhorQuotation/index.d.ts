import { type AxiosInstance } from "axios";
import type { Quotation } from "../../models/Quotation";
import type { QuotationRequest } from "../../models/Shipping";
import type { QuotationAdapter } from "../core/types/QuotationAdapter";
export default class MelhorQuotation implements QuotationAdapter {
    adapterApi: AxiosInstance;
    constructor();
    quotation(quotation: QuotationRequest): Promise<Quotation>;
}
