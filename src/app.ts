import express from 'express';
import bodyParser from 'body-parser';
import transcriptionRoutes from './routes/transcriptionRoutes';
import cors from 'cors';
import azureRoutes from "./routes/azureRoutes";

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.use('/', transcriptionRoutes);
app.use('/', azureRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

export default app;
