import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { router } from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));


app.use(router);

app.listen(3000, () => console.log('Server is running on port 3000'));