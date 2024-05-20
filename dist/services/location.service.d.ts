declare class LocationService {
    constructor();
    getAddressByCep(zipCode: string): Promise<{
        zipCode: string;
        state: string;
        city: string;
        neighborhood: string;
        street: string;
    }>;
}
declare const locationService: LocationService;
export default locationService;
