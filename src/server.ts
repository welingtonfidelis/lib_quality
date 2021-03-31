import express from 'express';

import './database/connection';
import { router } from './routes';
import { errorHandleMidleware } from './middlewares/errorHandle';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', router);
app.use(errorHandleMidleware);

app.listen(port, async () => {
  console.log(`🚀 Running in ${port}`);
});
