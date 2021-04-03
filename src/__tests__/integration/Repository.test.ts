import request from 'supertest';
import mongoose from 'mongoose';

import databaseConnection from '../../database/connection';
import { RepositoryService } from '../../services';
import utils from '../../utils/utils';
import { app } from '../../app';

const repositoryService = new RepositoryService();

describe('Repository', () => {
  beforeAll(() => {
    databaseConnection();
  });

  afterAll(async () => {
    await utils.dropAllCollections();

    await mongoose.connection.close();
  });

  test(
    'Should be able get total open issues, average and standard desviation about '
  + 'time openned issues',
    async () => {
      const response = await request(app)
        .get('/api/repository/octocat/Hello-World/issues');

      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status_code: 200,
        message: 'success',
        data: {},
      });
    },
  );
});
