import type { Request, Response } from 'express';
import packageService from '../services/packages.service';
import type { QuotationRequest } from '../models/Shipping';
import { defaultSender } from '../data/defaultData';
import type { Quotation, QuotationOption, QuotationOptionTag } from '../models/Quotation';
import MelhorQuotation from '../adapters/MelhorQuotation';
import KgQuotation from '../adapters/KgQuotation';
import FlexQuotation from '../adapters/FlexQuotation';
import LogQuotation from '../adapters/LogQuotation';

const quotationController = {

    async quotation(req: Request, res: Response) {
        try {
            const { zipCode, packageId, weight, height, width, length, insurancePrice, reverse
            } = req.query as {
                zipCode: string, packageId: string, weight: string, height: string, width: string, length: string, insurancePrice: string, reverse: string | undefined
            };
            const shipping: QuotationRequest = {
                customerFrom: reverse ? { adress: { zipCode } } : defaultSender,
                customerTo: reverse ? defaultSender : { adress: { zipCode } },
            } as QuotationRequest;

            if (packageId) {
                shipping.package = await packageService.getById(packageId);
            } else if (weight && height && width && length) {
                shipping.package = {
                    weight: parseFloat(weight), height: parseFloat(height), width: parseFloat(width), length: parseFloat(length),
                    insurancePrice: parseFloat(insurancePrice)
                }
            } else {
                throw new Error("Informe o codigo ou as dimensões do pacote");
            }
            const quotation: Quotation = { options: [], _metadata: [] } as Quotation;

            if (!shipping)
                throw new Error('Erro ao criar envio');
            const logQuotationAdapter = new LogQuotation();
            const logQuotationsOptions = await logQuotationAdapter.quotation(shipping)
            quotation.options = [...quotation.options, ...logQuotationsOptions.options];
            quotation._metadata = [{ logQuotation: logQuotationsOptions._metadata }];

            const melhorQuotationAdapter = new MelhorQuotation();
            const melhorQuotationsOptions = await melhorQuotationAdapter.quotation(shipping)
            quotation.options = [...quotation.options, ...melhorQuotationsOptions.options];
            quotation._metadata = [{ melhorQuotation: melhorQuotationsOptions._metadata }];

            const kgQuotation = new KgQuotation();
            const kgQuotationOptions = await kgQuotation.quotation(shipping)
            quotation.options = [...quotation.options, ...kgQuotationOptions.options];
            quotation._metadata = [...quotation._metadata, { kgQuotationOptions: kgQuotationOptions._metadata }];

            const flexQuotationAdapter = new FlexQuotation();
            const flexQuotationOptions = await flexQuotationAdapter.quotation(shipping)
            quotation.options = [...quotation.options, ...flexQuotationOptions.options];
            quotation._metadata = [...quotation._metadata, { flexQuotationOptions: flexQuotationOptions._metadata }];

            quotation.options = quotation.options
                .filter((option) => option.price)
                .sort((current, compared) => current.price - compared.price);

            let cheapestOption: QuotationOption | null = null;
            quotation.options.forEach((option: QuotationOption) => {
                if (option.price && (!cheapestOption || option.price < cheapestOption.price)) {
                    if (cheapestOption) {
                        cheapestOption.tags = (cheapestOption?.tags || []).filter((tag: QuotationOptionTag) => tag !== 'cheaper'); // Remove a tag 'cheaper' da opção anteriormente mais barata
                    }
                    cheapestOption = option;
                    cheapestOption.tags = [...(cheapestOption?.tags || []), 'cheaper']; // Adiciona a tag 'cheaper' à opção mais barata
                }
            });

            let fasterOption: QuotationOption | null = null;
            quotation.options.forEach((option: QuotationOption) => {
                if (option.deliveryEstimate || !fasterOption) {
                    const currentOptionDeliveryEstimate = option.deliveryEstimate ? new Date(option.deliveryEstimate) : '';
                    const comparedOptionDeliveryEstimate = fasterOption?.deliveryEstimate ? new Date(fasterOption?.deliveryEstimate) : '';
                    if (!comparedOptionDeliveryEstimate || currentOptionDeliveryEstimate < comparedOptionDeliveryEstimate) {

                        if (fasterOption) {
                            fasterOption.tags = (fasterOption?.tags || []).filter((tag: QuotationOptionTag) => tag !== 'faster'); // Remove a tag 'cheaper' da opção anteriormente mais barata
                        }
                        fasterOption = option;
                        fasterOption.tags = [...(fasterOption?.tags || []), 'faster'];
                    }
                }
            });


            res.status(201).json(quotation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao fazer cotação', error: JSON.stringify(error) });
        }
    }
};

export default quotationController;
