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
const location_service_1 = __importDefault(require("../../services/location.service"));
dotenv.config();
class LogQuotation {
    adapterApi;
    constructor() {
        this.adapterApi = axios_1.default.create({
            baseURL: `${process.env.LOG_QUOTATION_URL}`,
            headers: {
                Authorization: `ApiKey ${process.env.LOG_QUOTATION_TOKEN}`,
            }
        });
    }
    async quotation(quotation) {
        try {
            const { zipCode: to } = quotation.customerTo.adress;
            const { zipCode: from } = quotation.customerFrom.adress;
            const addressTo = await location_service_1.default.getAddressByCep(to);
            const addressFrom = await location_service_1.default.getAddressByCep(from);
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
            };
        }
        catch (error) {
            console.error(error);
            throw new Error("Erro ao calcular frete");
        }
    }
}
exports.default = LogQuotation;
//# sourceMappingURL=index.js.map