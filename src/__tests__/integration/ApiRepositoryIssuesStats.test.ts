/* eslint-disable no-undef */
import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import databaseConnection from '../../database/connection';
import { RepositoryRepository } from '../../repositories';

const repositoryRepository = new RepositoryRepository();

describe('RepositoryIssuesStats', () => {
  beforeAll(async () => {
    await databaseConnection();

    await repositoryRepository.removeAll();
  });

  afterAll(async () => {
    await repositoryRepository.removeAll();

    await mongoose.connection.close();
  });

  test('Should be able get repositories list empty', async () => {
    const response = await request(app)
      .get('/api/repository/issues/stats');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status_code: 200,
      message: 'success',
      data: {},
    });
    expect(response.body.data).toMatchObject({
      repositories: [],
    });
    expect(response.body.data.repositories.length).toBe(0);
  });

  test('Should be able get repositories list with issues group state', async () => {
    await repositoryRepository.create('octocat', 'Hello-World');

    const response = await request(app)
      .get('/api/repository/issues/stats');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status_code: 200,
      message: 'success',
      data: {},
    });
    expect(response.body.data).toMatchObject({
      repositories: [{}],
    });
    expect(response.body.data.repositories.length).toBeGreaterThan(0);
  });
});
