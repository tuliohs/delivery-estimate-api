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
exports.sanitize = void 0;
const date_fns_1 = require("date-fns");
const dotenv = __importStar(require("dotenv"));
const location_service_1 = __importDefault(require("../../services/location.service"));
dotenv.config();
const sanitize = (name) => name
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '');
exports.sanitize = sanitize;
class FlexQuotation {
    servicedCities = [
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
    ];
    constructor() {
    }
    getDeliveryDate() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // Domingo: 0, Segunda: 1, Terça: 2, ..., Sábado: 6
        const hour = 19; // Sempre 19:00
        let deliveryDate;
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Se for sábado ou domingo
            const daysToAdd = dayOfWeek === 0 ? 1 : 2;
            deliveryDate = (0, date_fns_1.addDays)(now, daysToAdd);
            deliveryDate.setHours(hour);
            deliveryDate.setMinutes(0);
            deliveryDate.setSeconds(0);
        }
        else { // Se for um dia da semana
            deliveryDate = (0, date_fns_1.addDays)(now, 1);
            deliveryDate.setHours(hour);
            deliveryDate.setMinutes(0);
            deliveryDate.setSeconds(0);
        }
        const formattedDeliveryDate = (0, date_fns_1.format)(deliveryDate, 'yyyy-MM-dd HH:mm:ss');
        return formattedDeliveryDate;
    }
    async quotation(quotation) {
        try {
            const { city } = await location_service_1.default.getAddressByCep(quotation.customerTo.adress.zipCode);
            const zipCodeIServiced = this.servicedCities.map((item) => (0, exports.sanitize)(item)).includes((0, exports.sanitize)(city));
            if (!zipCodeIServiced)
                return {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    options: [], _metadata: { message: 'CEP não atendido pelo flex' }
                };
            return {
                options: [{
                        gateway: 'Flex Quotation',
                        company: 'Flex',
                        service: 'Avulso',
                        price: 11.99,
                        deliveryEstimate: this.getDeliveryDate()
                    }]
            };
        }
        catch (error) {
            console.error(error);
            throw new Error("Erro ao calcular frete");
        }
    }
}
exports.default = FlexQuotation;
//# sourceMappingURL=index.js.map