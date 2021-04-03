import mongoose from 'mongoose';

import { RepositoryService } from '../../services';
import utils from '../../utils/utils';

const repositoryService = new RepositoryService();

describe('Repository', () => {
  // beforeAll(async () => {
  //   const url = 'mongodb://root:root@localhost:27017/test?authSource=admin';
  //   await mongoose.connect(url, { useNewUrlParser: true });
  // });

  // afterAll(async () => {
  //   await utils.dropAllCollections();

  //   await mongoose.connection.close();
  // });

  test('Test', async () => {
    expect(2 + 2).toBe(4);
  });
});
