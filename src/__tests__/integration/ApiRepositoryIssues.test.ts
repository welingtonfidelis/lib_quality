/* eslint-disable no-undef */
import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import databaseConnection from '../../database/connection';
import { RepositoryRepository } from '../../repositories';

const repositoryRepository = new RepositoryRepository();

describe('RepositoryIsses', () => {
  beforeAll(async () => {
    await databaseConnection();

    await repositoryRepository.removeAll();
  });

  afterAll(async () => {
    await repositoryRepository.removeAll();

    await mongoose.connection.close();
  });

  test(
    'Should be able get total open issues, average and standard deviation about time openned issues',
    async () => {
      const response = await request(app)
        .get('/api/repository/octocat/Hello-World/issues');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status_code: 200,
        message: 'success',
        data: {},
      });
    },
  );

  test('Should be able get 404 error', async () => {
    const response = await request(app)
      .get('/api/repository/octocat/Hello-W/issues');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      status_code: 404,
      message: 'Not Found',
      data: {},
    });
  });
});
