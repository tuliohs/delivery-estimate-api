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
        weight: 0.700,
        insurancePrice: 60
    },
    {
        id: 'box3',
        width: 26,
        height: 9,
        length: 18,
        weight: 0.800,
        insurancePrice: 70
    }
]