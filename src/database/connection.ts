import mongoose from 'mongoose';
import { resolve } from 'path';
import { config } from 'dotenv';

const path = resolve(__dirname, '../', 'enviroments', '.env');
config({ path });

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('useFindAndModify', false);

module.exports = mongoose;
