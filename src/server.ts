import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import * as dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/', routes);

const PORT = process.env.PORT || 8022;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
