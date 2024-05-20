"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const date_fns_1 = require("date-fns");
const date_1 = require("../../utils/date");
dotenv.config();
class MelhorQuotation {
    adapterApi;
    constructor() {
        this.adapterApi = axios_1.default.create({
            baseURL: `${process.env.MELHOR_QUOTATION_URL}/v2`,
        });
    }
    async quotation(quotation) {
        try {
            const { width, height, length, weight, insurancePrice } = quotation.package;
            const { zipCode: to } = quotation.customerTo.adress;
            const { zipCode: from } = quotation.customerFrom.adress;
            const availableServices = '1,2,17,28,29,30,31,3,4,27,10,12,15,16,19,20,12,22';
            const params = `from=${from}&to=${to}&width=${width}&weight=${weight}&height=${height}&length=${length}&insurance_value=${insurancePrice}&services=${availableServices}`;
            const { data } = await this.adapterApi.get(`/calculator?${params}`);
            const today = new Date();
            return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options: data.map((option) => ({
                    gateway: 'Melhor Quotation',
                    company: option?.company?.name,
                    service: option.name,
                    price: option.price,
                    deliveryEstimate: option.delivery_time ? (0, date_1.getNextBusinessDay)((0, date_fns_1.addDays)(today, option.delivery_time)) : undefined,
                })),
                _metadata: data
            };
        }
        catch (error) {
            console.error(error);
            throw new Error("Erro ao calcular frete");
        }
    }
}
exports.default = MelhorQuotation;
//# sourceMappingURL=index.js.map