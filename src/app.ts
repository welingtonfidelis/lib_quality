import express from 'express';

import databaseConnection from './database/connection';
import { router } from './routes';
import { errorHandleMidleware } from './middlewares/errorHandle';

databaseConnection();
const app = express();

app.use(express.json());
app.use('/api', router);
app.use(errorHandleMidleware);

export {
  app,
};
