import axios, { type AxiosInstance } from "axios";
import type { Quotation } from "../../models/Quotation";
import type { QuotationRequest } from "../../models/Shipping";
import type { QuotationAdapter } from "../core/types/QuotationAdapter";

import * as dotenv from 'dotenv';
dotenv.config();

export default class MelhorQuotation implements QuotationAdapter {
    adapterApi: AxiosInstance;

    constructor() {
        this.adapterApi = axios.create({
            baseURL: `${process.env.MELHOR_QUOTATION_URL}/v2`,
        });
    }

    async quotation(quotation: QuotationRequest): Promise<Quotation> {
        try {
            const { width, height, length, weight, insurancePrice } = quotation.package
            const { zipCode: to } = quotation.customerTo.adress
            const { zipCode: from } = quotation.customerFrom.adress

            const availableServices = '1,2,17,28,29,30,31,3,4,27,10,12,15,16,19,20,12,22'
            const params = `from=${from}&to=${to}&width=${width}&weight=${weight}&height=${height}&length=${length}&insurance_value=${insurancePrice}&services=${availableServices}`
            const { data } = await this.adapterApi.get(`/calculator?${params}`);

            return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options: data.map((option: any) => ({
                    gateway: 'Melhor Quotation',
                    company: option?.company?.name,
                    service: option.name,
                    price: option.price,
                    deliveryEstimate: option.delivery_time  
                })),
                _metadata: data
            }
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao calcular frete");
        }
    }
}