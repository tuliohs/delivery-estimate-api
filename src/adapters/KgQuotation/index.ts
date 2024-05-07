import axios, { type AxiosInstance } from "axios";
import type { Quotation } from "../../models/Quotation";
import type { QuotationRequest } from "../../models/Shipping";
import type { QuotationAdapter } from "../core/types/QuotationAdapter";

import * as dotenv from 'dotenv';
dotenv.config();

export default class KgQuotation implements QuotationAdapter {
    adapterApi: AxiosInstance;

    constructor() {
        this.adapterApi = axios.create({
            baseURL: `${process.env.KG_QUOTATION_URL}`,
            headers: { token: process.env.KG_QUOTATION_TOKEN }
        });
    }

    async quotation(quotation: QuotationRequest): Promise<Quotation> {
        try {
            const { width, height, length, weight, insurancePrice } = quotation.package
            const { zipCode: to } = quotation.customerTo.adress
            const { zipCode: from } = quotation.customerFrom.adress

            const { data } = await this.adapterApi.post(`/tms/transporte/simular`, {
                "cepOrigem": to,
                "cepDestino": from,
                "vlrMerc": insurancePrice,
                "pesoMerc": weight,
                "volumes": [
                    {
                        "peso": weight,
                        "altura": width,
                        "largura": height,
                        "comprimento": length,
                        "tipo": "string",
                        "valor": insurancePrice,
                        "quantidade": 1
                    }
                ],
                "produtos": [
                    {
                        "peso": weight,
                        "altura": width,
                        "largura": height,
                        "comprimento": length,
                        "valor": insurancePrice,
                        "quantidade": 1
                    }
                ],
                //"servicos": [
                //  "string"
                //],
                //"ordernar": "string"
            });


            return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options: data.map((option: any) => ({
                    gateway: 'KG Quotation',
                    company: option?.transp_nome,
                    service: option.descricao,
                    price: option.vlrFrete,
                    deliveryEstimate: option.dtPrevEnt
                })),
                _metadata: data
            }
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao calcular frete");
        }
    }
}