import type { Request, Response } from 'express';
import express from 'express'

import quotationController from './controllers/quotation.controller';

const router = express.Router();

router.get('/ping', (_req: Request, res: Response) => {
    return res.send('pong 🏓')
})

router.get('/api/quotation', quotationController.quotation);
router.get('/api/packages', quotationController.listPackages);
router.get('/api/defaultSender', quotationController.defaultSender);

router.get('/api/health', (req, res) => {
    return res.status(200).send({ status: 'ok' });
})

export default router