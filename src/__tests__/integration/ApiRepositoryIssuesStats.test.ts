/* eslint-disable no-undef */
import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import databaseConnection from '../../database/connection';
import { DatabaseCollectionRepository, RepositoryRepository } from '../../repositories';

describe('RepositoryIssuesStats', () => {
  beforeAll(async () => {
    await databaseConnection();

    const databaseCollectionRepository = new DatabaseCollectionRepository();
    await databaseCollectionRepository.dropAllCollections();
  });

  afterAll(async () => {
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
    const repositoryRepository = new RepositoryRepository();
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
