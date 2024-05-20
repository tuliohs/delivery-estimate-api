"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class LocationService {
    constructor() {
    }
    async getAddressByCep(zipCode) {
        try {
            const { data: buscaCEP } = await axios_1.default.get(`https://viacep.com.br/ws/${zipCode}/json/`);
            return {
                zipCode: zipCode,
                state: buscaCEP.uf,
                city: buscaCEP.localidade,
                neighborhood: buscaCEP.bairro,
                street: buscaCEP.logradouro
            };
        }
        catch (error) {
            console.error('Erro ao obter cep:', error);
            throw error;
        }
    }
}
const locationService = new LocationService();
exports.default = locationService;
//# sourceMappingURL=location.service.js.map