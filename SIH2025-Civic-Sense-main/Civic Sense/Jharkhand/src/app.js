import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound, globalError } from './middlewares/error.js';


const app = express();


app.use(helmet());
app.use(cors({ origin: env.clientUrl === '*' ? true : [env.clientUrl], credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
if (env.nodeEnv === 'development') app.use(morgan('dev'));


app.get('/', (_req, res) => res.json({ status: 'ok', message: 'Civic Issue API' }));
app.use('/api/v1', routes);


app.use(notFound);
app.use(globalError);


export default app;