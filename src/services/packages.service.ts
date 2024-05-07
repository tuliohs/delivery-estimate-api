import type { Package } from "../models/Shipping";
import { defaultPackages } from "../data/defaultData";

class PackageService {
    constructor() {

    }
    async getById(id: string): Promise<Package> {
        try {
            const item = defaultPackages.find(p => p.id === id);
            if (!item)
                throw new Error("Pacote não encontrado");

            return item;	
        } catch (error) {
            console.error('Erro ao obter pacotes por ID:', error);
            throw error;
        }
    }
}

const packageService = new PackageService();
export default packageService
