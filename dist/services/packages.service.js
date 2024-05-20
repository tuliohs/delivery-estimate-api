"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultData_1 = require("../data/defaultData");
class PackageService {
    constructor() {
    }
    async getById(id) {
        try {
            const item = defaultData_1.defaultPackages.find(p => p.id === id);
            if (!item)
                throw new Error("Pacote não encontrado");
            return item;
        }
        catch (error) {
            console.error('Erro ao obter pacotes por ID:', error);
            throw error;
        }
    }
}
const packageService = new PackageService();
exports.default = packageService;
//# sourceMappingURL=packages.service.js.map