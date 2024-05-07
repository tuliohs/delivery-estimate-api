import axios, { type AxiosInstance } from "axios";
import type { Quotation } from "../../models/Quotation";
import type { QuotationRequest } from "../../models/Shipping";
import type { QuotationAdapter } from "../core/types/QuotationAdapter";

import * as dotenv from 'dotenv';
import locationService from "../../services/location.service";
dotenv.config();

export default class LogQuotation implements QuotationAdapter {
    adapterApi: AxiosInstance;

    constructor() {
        this.adapterApi = axios.create({
            baseURL: `${process.env.LOG_QUOTATION_URL}`,
            headers: {
                Authorization: `ApiKey ${process.env.LOG_QUOTATION_TOKEN}`,
            }
        })
    }

    async quotation(quotation: QuotationRequest): Promise<Quotation> {
        try {
            const { zipCode: to } = quotation.customerTo.adress
            const { zipCode: from } = quotation.customerFrom.adress

            const addressTo = await locationService.getAddressByCep(to)
            const addressFrom = await locationService.getAddressByCep(from)
            const query = `
                 {
                estimateCreateOrder(
                    pickups: [
                    {
                        address: {
                        address: "${addressTo.street}, ${addressTo.city} ${addressTo.state} ${addressTo.zipCode}",
                        complement: ""
                        },
                        instructions: ""
                    }
                    ],
                    packages: [
                    {
                        pickupIndex: 0,
                        address: {
                        address: "${addressFrom.street}, ${addressFrom.city} ${addressFrom.state} ${addressFrom.zipCode}",
                        complement: ""
                        },
                        instructions: ""
                    }
                    ]
                ) {
                    totalEstimate {
                    totalCost
                    totalEta
                    totalDistance
                    },
                    packagesWithErrors {
                    originalIndex
                    error
                    resolvedAddress
                    }
                }
                }
                `;

            const { data } = await this.adapterApi.post('', { query });

            return {
                options: [{
                    gateway: 'Log Quotation',
                    company: 'Log Quotation',
                    service: 'Log Quotation',
                    price: data?.data?.estimateCreateOrder?.totalEstimate?.totalCost,
                    deliveryEstimate: 'Não informada'
                }],
                _metadata: data
            }
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao calcular frete");
        }
    }
}