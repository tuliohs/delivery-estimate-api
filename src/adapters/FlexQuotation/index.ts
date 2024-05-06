import axios from "axios";
import type { Quotation } from "../../models/Quotation";
import type { QuotationRequest } from "../../models/Shipping";
import type { QuotationAdapter } from "../core/types/QuotationAdapter";

import * as dotenv from 'dotenv';
dotenv.config();

export const sanitize = (name: string) =>
    name
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036F]/g, '')

export default class FlexQuotation implements QuotationAdapter {

    private servicedCities: string[] = [
        'Belo Horizonte',
        'Contagem',
        'Ibirité',
        'Sabará',
        'Santa Luzia',
        'Vespasiano',
        'Betim',
        'Ribeirão das Neves',
        'Nova Lima',
        'Venda Nova',
        'Brumadinho',
        'Sarzedo',
        'Igarapé',
        'Mateus Leme',
        'Juatuba',
        'Pedro Leopoldo',
        'Lagoa Santa',
        'Caeté'
    ]
    constructor() {
    }

    private getDeliveryDate() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // Domingo: 0, Segunda: 1, Terça: 2, ..., Sábado: 6
        const hour = now.getHours();

        const deliveryTimeStart = '15:30';
        const deliveryTimeEnd = '21:00';

        if ((dayOfWeek === 6 && hour >= 12) || dayOfWeek === 0) {
            let daysToAdd;
            if (dayOfWeek === 0) {
                daysToAdd = 1;
            } else {
                daysToAdd = 2;
            }
            const monday = new Date(now);
            monday.setDate(now.getDate() + daysToAdd);

            const mondayFormatted = `${monday.getDate()}/${monday.getMonth() + 1}/${monday.getFullYear()}`;
            return `Segunda-feira (${mondayFormatted}) entre ${deliveryTimeStart} e ${deliveryTimeEnd}`;
        } else if (hour >= 12) {
            return `Amanhã entre ${deliveryTimeStart} e ${deliveryTimeEnd}`;
        } else {
            return `Hoje entre ${deliveryTimeStart} e ${deliveryTimeEnd}`;
        }
    }


    async quotation(quotation: QuotationRequest): Promise<Quotation> {
        try {
            const { data: buscaCEP } = await axios.get(`https://viacep.com.br/ws/${quotation.customerTo.adress.zipCode}/json/`);

            const city = buscaCEP.localidade;

            const zipCodeIServiced = this.servicedCities.map((item) => sanitize(item)).includes(sanitize(city))

            if (!zipCodeIServiced)
                return {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    options: [], _metadata: { message: 'CEP não atendido pelo flex' } as any
                }
            return {
                options: [{
                    gateway: 'Flex Quotation',
                    company: 'Flex',
                    service: 'Avulso',
                    price: 11.99,
                    deliveryEstimate: this.getDeliveryDate()
                }],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _metadata: { buscaCEP: buscaCEP } as any
            }
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao calcular frete");
        }
    }
}