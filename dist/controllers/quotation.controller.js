"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const packages_service_1 = __importDefault(require("../services/packages.service"));
const defaultData_1 = require("../data/defaultData");
const MelhorQuotation_1 = __importDefault(require("../adapters/MelhorQuotation"));
const KgQuotation_1 = __importDefault(require("../adapters/KgQuotation"));
const FlexQuotation_1 = __importDefault(require("../adapters/FlexQuotation"));
const LogQuotation_1 = __importDefault(require("../adapters/LogQuotation"));
const quotationController = {
    async quotation(req, res) {
        try {
            const { zipCode, packageId, weight, height, width, length, insurancePrice } = req.query;
            const shipping = {
                customerFrom: defaultData_1.defaultSender,
                customerTo: { adress: { zipCode } },
            };
            if (packageId) {
                shipping.package = await packages_service_1.default.getById(packageId);
            }
            else if (weight && height && width && length) {
                shipping.package = {
                    weight: parseFloat(weight), height: parseFloat(height), width: parseFloat(width), length: parseFloat(length),
                    insurancePrice: parseFloat(insurancePrice)
                };
            }
            else {
                throw new Error("Informe o codigo ou as dimensões do pacote");
            }
            const quotation = { options: [], _metadata: [] };
            if (!shipping)
                throw new Error('Erro ao criar envio');
            const logQuotationAdapter = new LogQuotation_1.default();
            const logQuotationsOptions = await logQuotationAdapter.quotation(shipping);
            quotation.options = [...quotation.options, ...logQuotationsOptions.options];
            quotation._metadata = [{ logQuotation: logQuotationsOptions._metadata }];
            const melhorQuotationAdapter = new MelhorQuotation_1.default();
            const melhorQuotationsOptions = await melhorQuotationAdapter.quotation(shipping);
            quotation.options = [...quotation.options, ...melhorQuotationsOptions.options];
            quotation._metadata = [{ melhorQuotation: melhorQuotationsOptions._metadata }];
            const kgQuotation = new KgQuotation_1.default();
            const kgQuotationOptions = await kgQuotation.quotation(shipping);
            quotation.options = [...quotation.options, ...kgQuotationOptions.options];
            quotation._metadata = [...quotation._metadata, { kgQuotationOptions: kgQuotationOptions._metadata }];
            const flexQuotationAdapter = new FlexQuotation_1.default();
            const flexQuotationOptions = await flexQuotationAdapter.quotation(shipping);
            quotation.options = [...quotation.options, ...flexQuotationOptions.options];
            quotation._metadata = [...quotation._metadata, { flexQuotationOptions: flexQuotationOptions._metadata }];
            quotation.options = quotation.options
                .filter((option) => option.price)
                .sort((current, compared) => current.price - compared.price);
            let cheapestOption = null;
            quotation.options.forEach((option) => {
                if (option.price && (!cheapestOption || option.price < cheapestOption.price)) {
                    if (cheapestOption) {
                        cheapestOption.tags = (cheapestOption?.tags || []).filter((tag) => tag !== 'cheaper'); // Remove a tag 'cheaper' da opção anteriormente mais barata
                    }
                    cheapestOption = option;
                    cheapestOption.tags = [...(cheapestOption?.tags || []), 'cheaper']; // Adiciona a tag 'cheaper' à opção mais barata
                }
            });
            let fasterOption = null;
            quotation.options.forEach((option) => {
                if (option.deliveryEstimate || !fasterOption) {
                    const currentOptionDeliveryEstimate = option.deliveryEstimate ? new Date(option.deliveryEstimate) : '';
                    const comparedOptionDeliveryEstimate = fasterOption?.deliveryEstimate ? new Date(fasterOption?.deliveryEstimate) : '';
                    if (!comparedOptionDeliveryEstimate || currentOptionDeliveryEstimate < comparedOptionDeliveryEstimate) {
                        if (fasterOption) {
                            fasterOption.tags = (fasterOption?.tags || []).filter((tag) => tag !== 'faster'); // Remove a tag 'cheaper' da opção anteriormente mais barata
                        }
                        fasterOption = option;
                        fasterOption.tags = [...(fasterOption?.tags || []), 'faster'];
                    }
                }
            });
            res.status(201).json(quotation);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao fazer cotação', error: JSON.stringify(error) });
        }
    }
};
exports.default = quotationController;
//# sourceMappingURL=quotation.controller.js.map