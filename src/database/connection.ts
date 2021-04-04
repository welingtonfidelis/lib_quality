import mongoose from 'mongoose';
import { resolve } from 'path';
import { config } from 'dotenv';

const path = resolve(__dirname, '../', 'enviroments', '.env');
config({ path });

const { MONGODB_URI, MONGODB_TESTS_URI, NODE_ENV } = process.env;
const URL = NODE_ENV === 'test' ? MONGODB_TESTS_URI : MONGODB_URI;

export default async () => {
  mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.set('useFindAndModify', false);

  return mongoose;
};
