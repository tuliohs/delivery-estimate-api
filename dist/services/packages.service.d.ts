import type { Package } from "../models/Shipping";
declare class PackageService {
    constructor();
    getById(id: string): Promise<Package>;
}
declare const packageService: PackageService;
export default packageService;
