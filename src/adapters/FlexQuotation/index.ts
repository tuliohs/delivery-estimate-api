import type { Quotation } from "../../models/Quotation";
import type { QuotationRequest } from "../../models/Shipping";
import type { QuotationAdapter } from "../core/types/QuotationAdapter";
import { addDays, format } from 'date-fns';

import * as dotenv from 'dotenv';
import locationService from "../../services/location.service";
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

    private getDeliveryDate(): string {
        const now: Date = new Date();
        const dayOfWeek: number = now.getDay(); // Domingo: 0, Segunda: 1, Terça: 2, ..., Sábado: 6
        const hour: number = 19; // Sempre 19:00

        let deliveryDate: Date;

        if (dayOfWeek === 0 || dayOfWeek === 6) { // Se for sábado ou domingo
            const daysToAdd: number = dayOfWeek === 0 ? 1 : 2;
            deliveryDate = addDays(now, daysToAdd);
            deliveryDate.setHours(hour);
            deliveryDate.setMinutes(0);
            deliveryDate.setSeconds(0);
        } else { // Se for um dia da semana
            deliveryDate = addDays(now, 1);
            deliveryDate.setHours(hour);
            deliveryDate.setMinutes(0);
            deliveryDate.setSeconds(0);
        }

        const formattedDeliveryDate: string = format(deliveryDate, 'yyyy-MM-dd HH:mm:ss');
        return formattedDeliveryDate;
    }


    async quotation(quotation: QuotationRequest): Promise<Quotation> {
        try {
            const { city } = await locationService.getAddressByCep(quotation.customerTo.adress.zipCode);

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
                }]
            }
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao calcular frete");
        }
    }
}