import axios from "axios";

class LocationService {
    constructor() {

    }
    async getAddressByCep(zipCode: string): Promise<{
        zipCode: string,
        state: string,
        city: string,
        neighborhood: string,
        street: string
    }> {
        try {
            const { data: buscaCEP } = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`);

            return {
                zipCode: zipCode,
                state: buscaCEP.uf,
                city: buscaCEP.localidade,
                neighborhood: buscaCEP.bairro,
                street: buscaCEP.logradouro
            }
        } catch (error) {
            console.error('Erro ao obter cep:', error);
            throw error;
        }
    }
}

const locationService = new LocationService();
export default locationService
