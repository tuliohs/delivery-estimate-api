import type { Package } from "../models/Shipping";

import * as dotenv from 'dotenv';
dotenv.config();

export const defaultSender = {
    adress: {
        zipCode: process.env.DEFAULT_SENDER_ZIPCODE,
    }
};

export const defaultPackages: Array<Package> = [
    {
        id: 'box1',
        width: 17,
        height: 10,
        length: 22,
        weight: 0.380,
        insurancePrice: 40
    },
    {
        id: 'box2',
        width: 17,
        height: 10,
        length: 22,
        weight: 0.600,
        insurancePrice: 60
    },
    {
        id: 'box3',
        width: 26,
        height: 9,
        length: 18,
        weight: 0.800,
        insurancePrice: 70
    },
    {
        id: 'pacote4kg',
        width: 25,
        height: 30,
        length: 30,
        weight: 4,
        insurancePrice: 398.60
    },
    {
        id: 'pacote5kg',
        width: 25,
        height: 25,
        length: 40,
        weight: 5,
        insurancePrice: 300
    },
    {
        id: 'tatv',
        width: 16,
        height: 16,
        length: 120,
        weight: 0.640,
        insurancePrice: 163
    }
]