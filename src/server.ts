import type { Request, Response } from 'express';
import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import quotationController from './controllers/quotation.controller';

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/ping', (_req: Request, res: Response) => {
    return res.send('pong 🏓')
})

app.get('/api/quotation', quotationController.quotation);

app.get('/api/health', (req, res) => {
    return res.status(200).send({ status: 'ok' });
})

const PORT = process.env.PORT || 8022;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
