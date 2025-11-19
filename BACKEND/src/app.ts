import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { router } from './routes';

// 1. CRIA A INSTÂNCIA PRIMEIRO
const app = express();

// 2. CONFIGURA OS MIDDLEWARES
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// 3. CONFIGURA AS ROTAS
app.use(router);

// 4. EXPORTA PARA O VERCEL E PARA O SERVER LOCAL
export default app;